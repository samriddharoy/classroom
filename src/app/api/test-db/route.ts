import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    return new Response("MongoDB Connected Successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    return new Response("MongoDB Connection Failed vro", { status: 500 });
  }
}
