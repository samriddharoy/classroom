import { connectToDatabase } from "@/lib/mongodb";
import Notes from "@/models/notes";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    // Add fallback to empty string if description is missing
    const description = (formData.get("description") as string) || "";
    const uploadedBy = formData.get("uploadedBy") as string;
    const uploadedAt = formData.get("uploadedAt") as string;
    const file = formData.get("file") as File;

    console.log("Description received:", description); // Debug log

    if (!file || !title || !uploadedBy || !uploadedAt) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Save file to /public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = join(process.cwd(), "public/uploads", fileName);

    await writeFile(filePath, buffer);

    await connectToDatabase();

    const newNote = await Notes.create({
      title,
      description,
      uploadedBy,
      uploadedAt,
      fileUrl: `/uploads/${fileName}`,
    });

    return NextResponse.json(newNote);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
