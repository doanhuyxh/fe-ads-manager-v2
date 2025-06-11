// models/schedule.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISchedule extends Document {
  _id: string;
  name: string;
  time: string; // HH:mm format
  typeSchedule: string; // overy-day, overy-hour, overy-minute
  distance: number, // distance running
  startDate: string; // YYYY-MM-DD format, date start spend
  keywords: string;
  accountId: string;
  chatZaloId: string;
  status: "active" | "inactive";
  templateZalo: string,
  lastRun: string
}

const ScheduleSchema: Schema<ISchedule> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
    default: '',
  },
  accountId: {
    type: String,
    required: true,
    default: '',
  },
  chatZaloId: {
    type: String,
    required: true,
    default: '',
  },
  typeSchedule: {
    type: String,
    required: true,
    default: '',
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
    default: "inactive",
  },
  templateZalo: {
    type: String,
    required: true,
    default: '',
  },
  lastRun: {
    type: String,
    default: '',
  },
  distance: {
    type: Number,
    required: true,
    default: 1,
  }
});

const ScheduleModel: Model<ISchedule> =
  mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default ScheduleModel;
