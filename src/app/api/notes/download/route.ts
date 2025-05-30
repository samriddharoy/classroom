import { NextResponse } from "next/server";
import { join } from "path";
import fs from "fs/promises";
import Notes from "@/models/notes";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  try {
    const note = await Notes.findById(id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const filePath = join(process.cwd(), "public", note.fileUrl);

    // Check if file exists asynchronously
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found on server" }, { status: 404 });
    }

    // Read entire file into memory (Buffer)
    const fileBuffer = await fs.readFile(filePath);

    const fileName = note.fileUrl.split("/").pop() || "file";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
