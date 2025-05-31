import { connectToDatabase } from "@/lib/mongodb"
import Note from "@/models/notes"

export async function GET(req: Request) {
    console.log(req)
    connectToDatabase()
    let notes = await Note.find()

    return Response.json({data: notes})
}
