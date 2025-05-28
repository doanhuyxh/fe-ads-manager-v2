// models/schedule.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISchedule extends Document {
  _id: string;
  time: string; // HH:mm format
  startDate: string; // YYYY-MM-DD format
  keywords: string;
  accountId: string;
  chatZaloId: string;
  status: "active" | "inactive";
}

const ScheduleSchema: Schema<ISchedule> = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
    default: "inactive",
  },
});

const ScheduleModel: Model<ISchedule> =
  mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default ScheduleModel;
