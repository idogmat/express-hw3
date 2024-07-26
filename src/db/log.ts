import mongoose, { Model } from "mongoose";

export interface LogTypeDB {
  IP: string;
  URL: string;
  date: Date;
  count: number;
}

// log
export const LogSchema = new mongoose.Schema<LogTypeDB, Model<LogTypeDB>>({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: { type: Date, required: true },
  count: { type: Number, required: true },
});
