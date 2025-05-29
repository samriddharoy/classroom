'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import DatePicker from '@/components/DatePicker'

export default function UploadPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert('Please select a file.')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)
    formData.append('uploadedAt', selectedDate?.toISOString() || new Date().toISOString())
    formData.append('uploadedBy', 'Teacher A') // Replace with real user later

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        alert('File uploaded successfully!')
        setTitle('')
        setFile(null)
        setSelectedDate(new Date())
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        alert(`Upload failed: ${data.message}`)
      }
    } catch (error) {
      alert(`Upload failed: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Notes</h1>

      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <Label>Title</Label>
          <Input
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label>Upload File</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label>Date of Upload</Label>
          <DatePicker onDateChange={(date) => setSelectedDate(date)} />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>
    </div>
  )
}
