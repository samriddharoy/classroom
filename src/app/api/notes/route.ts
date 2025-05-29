import { NextResponse } from "next/server"
import path from "path"
import { Readable } from "stream"
import { IncomingForm, File as FormidableFile } from "formidable"

import Note from "@/models/notes"
import { connectToDatabase } from "@/lib/mongodb"

export const runtime = "nodejs"

export const config = {
  api: {
    bodyParser: false,
  },
}

// Convert Next.js ReadableStream to Node.js Readable stream
function toNodeReadableStream(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader()
  return new Readable({
    read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          this.push(null)
        } else {
          this.push(Buffer.from(value))
        }
      })
    },
  })
}

export async function POST(request: Request) {
  await connectToDatabase()

  if (!request.body) {
    return NextResponse.json({ message: "No request body" }, { status: 400 })
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  })

  // Convert the ReadableStream to Node.js stream
  const nodeStream = toNodeReadableStream(request.body)

  // Extract headers from Next.js request and add them to nodeStream object
  const headersObj: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headersObj[key.toLowerCase()] = value
  })

  // Create a "fake" request object with headers property
  const fakeReq = Object.assign(nodeStream, { headers: headersObj })

  return new Promise<NextResponse>((resolve) => {
    form.parse(fakeReq as any, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err)
        resolve(
          NextResponse.json(
            { message: "File upload error", error: err.message },
            { status: 500 }
          )
        )
        return
      }

      try {
        const { title, uploadedBy, uploadedAt } = fields as {
          title?: string
          uploadedBy?: string
          uploadedAt?: string
        }

        const file = files.file as FormidableFile | undefined

        if (!title || !uploadedBy || !file) {
          resolve(
            NextResponse.json(
              { message: "Missing required fields or file" },
              { status: 400 }
            )
          )
          return
        }

        console.log("Uploaded file object:", file)

        const savedFilePath = (file as any).filepath || (file as any).path

        if (!savedFilePath) {
          console.error("Saved file path not found:", file)
          resolve(
            NextResponse.json(
              { message: "File path not found after upload" },
              { status: 500 }
            )
          )
          return
        }

        const fileName = path.basename(savedFilePath)
        const fileUrl = `/uploads/${fileName}`

        const newNote = new Note({
          title,
          uploadedBy,
          uploadedAt: uploadedAt ? new Date(uploadedAt) : new Date(),
          fileUrl,
        })

        await newNote.validate()
        await newNote.save()

        resolve(
          NextResponse.json(
            { message: "Note uploaded successfully", note: newNote },
            { status: 201 }
          )
        )
      } catch (error: any) {
        console.error("Error saving note:", error)
        resolve(
          NextResponse.json(
            { message: "Failed to save note", error: error.message },
            { status: 500 }
          )
        )
      }
    })
  })
}

export async function GET() {
  try {
    await connectToDatabase()
    const notes = await Note.find().sort({ uploadedAt: -1 })
    return NextResponse.json(notes, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch notes", error: (error as Error).message },
      { status: 500 }
    )
  }
}
