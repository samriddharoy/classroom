'use client'

import React, { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import DatePicker from '@/components/ui/DatePicker'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function UploadPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'default' | 'destructive'
    title: string
    description?: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    setAlert(null) // Clear previous alert

    if (!file) {
      setAlert({
        type: 'destructive',
        title: 'Validation Error',
        description: 'Please select a file.',
      })
      return
    }
    if (!title.trim()) {
      setAlert({
        type: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a title.',
      })
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('file', file)
    formData.append('uploadedAt', selectedDate?.toISOString() || new Date().toISOString())
    formData.append('uploadedBy', 'Teacher A') // Replace with actual user

    try {
      const res = await fetch('/api/notes/upload', {
        method: 'POST',
        body: formData,
      })

      const contentType = res.headers.get('content-type')
      const data = contentType?.includes('application/json') ? await res.json() : null

      if (res.ok) {
        setAlert({
          type: 'default',
          title: 'Success!',
          description: 'File uploaded successfully.',
        })
        setTitle('')
        setDescription('')
        setFile(null)
        setSelectedDate(new Date())
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setAlert({
          type: 'destructive',
          title: 'Upload Failed',
          description: data?.message || 'Unknown error',
        })
      }
    } catch (error) {
      setAlert({
        type: 'destructive',
        title: 'Upload Failed',
        description: (error as Error).message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12 space-y-4">
      {/* Alert shown ABOVE the Card */}
      {alert && (
        <Alert variant={alert.type}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.description && <AlertDescription>{alert.description}</AlertDescription>}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Notes</CardTitle>
          <CardDescription>Share study materials with your students</CardDescription>
        </CardHeader>

        <form onSubmit={handleUpload}>
          <CardContent className="space-y-5">
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
              <Label>Description</Label>
              <textarea
                className="w-full border rounded p-2 focus:outline-none focus:ring"
                rows={3}
                placeholder="Enter a brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
