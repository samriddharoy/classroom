import { NextResponse } from "next/server";
import Notes from "@/models/notes";
import { connectToDatabase } from "@/lib/mongodb";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectToDatabase();

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  try {
    const note = await Notes.findById(id);
    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    await Notes.findByIdAndDelete(id);
    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
