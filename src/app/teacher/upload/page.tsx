'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

 function UploadPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    alert(`Uploaded "${title}" with file "${file.name}"`);
    // Upload logic will go here later
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Notes</h1>
      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="file">Upload File</Label>
          <Input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Upload</Button>
      </form>
    </div>
  );
}
export default UploadPage;