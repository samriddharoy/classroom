"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [alert, setAlert] = useState<{
    type: "default" | "destructive";
    title: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes", { method: "GET" });
        const data_received = await res.json();
        const data: Note[] = data_received.data;

        const formatted: Note[] = data.map((note: any) => ({
          id: note._id,
          title: note.title,
          description: note.description || "No description provided.",
          uploadedBy: note.uploadedBy,
          uploadedAt: note.uploadedAt,
          fileUrl: note.fileUrl,
        }));

        setNotes(formatted);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setAlert({
          type: "destructive",
          title: "Fetch Failed",
          description: "Could not load notes. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        setAlert({
          type: "destructive",
          title: "Delete Failed",
          description: error.message || "Unknown error occurred.",
        });
        return;
      }

      setNotes((prev) => prev.filter((note) => note.id !== id));
      setAlert({
        type: "default",
        title: "Deleted",
        description: "The note has been deleted successfully.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      setAlert({
        type: "destructive",
        title: "Delete Error",
        description: "Something went wrong while deleting the note.",
      });
    }
  };

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto text-center">
        <p>Loading notes...</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Student Notes</h1>

      {/* Alert outside cards */}
      {alert && (
        <Alert variant={alert.type}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.description && <AlertDescription>{alert.description}</AlertDescription>}
        </Alert>
      )}

      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        notes.map((note) => (
          <Card key={note.id} className="shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{note.description}</p>
              <p className="text-sm text-gray-500 mt-3">
                Uploaded by: {note.uploadedBy} |{" "}
                {new Date(note.uploadedAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end">
              <a
                href={`/api/notes/download?id=${note.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                download
              >
                Download
              </a>
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </CardFooter>
          </Card>
        ))
      )}
    </main>
  );
}
