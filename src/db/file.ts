import mongoose, { Model, ObjectId } from 'mongoose';


export type FileTypeDB = {
  _id: ObjectId;
  userId: string;
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  uploadDate: Date;
};
export const FileSchema = new mongoose.Schema<FileTypeDB,Model<FileTypeDB>>({
  userId: {
    type: String,
  },
  originalname: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  // Дополнительные поля, если нужно
  buffer: {
    type: Buffer,
    default: {},
  },
});
