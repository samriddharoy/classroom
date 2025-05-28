// app/student/notes/page.tsx

"use client";

import React, { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  fileUrl: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching notes data (replace with real fetch)
  useEffect(() => {
    async function fetchNotes() {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 500));

      const mockNotes: Note[] = [
        {
          id: "1",
          title: "React Basics",
          description: "Introduction to React hooks and components.",
          uploadedBy: "Teacher A",
          uploadedAt: "2025-05-20",
          fileUrl: "/files/react-basics.pdf",
        },
        {
          id: "2",
          title: "Advanced JavaScript",
          description: "Deep dive into closures, async/await.",
          uploadedBy: "Teacher B",
          uploadedAt: "2025-05-22",
          fileUrl: "/files/advanced-js.pdf",
        },
      ];

      setNotes(mockNotes);
      setLoading(false);
    }

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto text-center">
        <p>Loading notes...</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Notes</h1>

      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{note.title}</h2>
                <p className="text-gray-700 mt-1">{note.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded by: {note.uploadedBy} |{" "}
                  {new Date(note.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <a
                href={note.fileUrl}
                download
                className="mt-4 sm:mt-0 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
