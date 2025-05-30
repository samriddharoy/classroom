import { NextRequest, NextResponse } from 'next/server'
import Busboy from 'busboy'
import fs from 'fs'
import path from 'path'
import Note from '@/models/notes'
import { connectToDatabase } from '@/lib/mongodb'
import { Readable } from 'stream'

export const config = {
  api: {
    bodyParser: false, // Important to disable built-in parser for Busboy to work
  },
}

export async function POST(req: NextRequest) {
  await connectToDatabase()

  const uploadDir = path.join(process.cwd(), '/public/uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  // Convert the NextRequest ReadableStream to Node.js Readable stream
  const stream = Readable.fromWeb(req.body as any)

  return new Promise<NextResponse>((resolve, reject) => {
    const headers = Object.fromEntries(req.headers.entries())
    const busboy = Busboy({ headers })

    const fields: Record<string, string> = {}
    let fileUrl = ''
    let filePath = ''

    busboy.on('file', (fieldname, file, filename) => {
      console.log(`File event fieldname: ${fieldname}, filename: ${filename}`)
      if (fieldname !== 'file') {
        // Drain unexpected file streams
        file.resume()
        return
      }

      const uniqueName = `${Date.now()}-${filename}`
      filePath = path.join(uploadDir, uniqueName)
      fileUrl = `/uploads/${uniqueName}`

      const writeStream = fs.createWriteStream(filePath)
      file.pipe(writeStream)

      writeStream.on('error', (err) => {
        console.error('File write error:', err)
        reject(
          NextResponse.json({ message: 'File write error', error: err.message }, { status: 500 })
        )
      })
    })

    busboy.on('field', (name, value) => {
      console.log(`Field event: ${name} = ${value}`)
      fields[name] = value
    })

    busboy.on('finish', async () => {
      console.log('Busboy finished parsing')
      try {
        const { title, uploadedBy, uploadedAt } = fields

        if (!title || !uploadedBy || !fileUrl) {
          return resolve(
            NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
          )
        }

        const newNote = new Note({
          title,
          uploadedBy,
          uploadedAt: uploadedAt ? new Date(uploadedAt) : new Date(),
          fileUrl,
        })

        await newNote.save()

        return resolve(
          NextResponse.json(
            { message: 'Note uploaded successfully', note: newNote },
            { status: 201 }
          )
        )
      } catch (error: any) {
        console.error('Error saving note:', error)
        return resolve(
          NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 })
        )
      }
    })

    stream.pipe(busboy)
  })
}
