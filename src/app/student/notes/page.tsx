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

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes", { method: "GET" });
        // if (!res.ok) throw new Error("Failed to fetch notes");
        const data_received = await res.json();
        console.log("received_data", data_received.data);
        const data: Note[] = data_received.data;

        // Map backend data (_id) to frontend structure (id)
        const formatted: Note[] = data.map((note: any) => ({
          id: note._id, // convert _id to id here
          title: note.title,
          description: note.description || "No description provided.",
          uploadedBy: note.uploadedBy,
          uploadedAt: note.uploadedAt,
          fileUrl: note.fileUrl,
        }));

        setNotes(formatted);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
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
                href={`/api/notes/download?id=${note.id}`}
                className="mt-4 sm:mt-0 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                download
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
