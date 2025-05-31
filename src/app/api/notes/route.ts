import { connectToDatabase } from "@/lib/mongodb";
import Note from "@/models/notes";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const notes = await Note.find();

    return NextResponse.json({ data: notes });
  } catch (error) {
    console.error("GET /notes error:", error);
    return NextResponse.json({ message: "Failed to fetch notes" }, { status: 500 });
  }
}
