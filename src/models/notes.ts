import mongoose, { Document, Model, Schema } from "mongoose";

interface INote extends Document {
  title: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl: string;
}

const NoteSchema: Schema<INote> = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: false,
  },

  uploadedBy: {
    type: String,
    required: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },

  fileUrl: {
    type: String,
    required: true,
  },
});

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
