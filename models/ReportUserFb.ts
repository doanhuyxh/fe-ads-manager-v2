// models/reportUserFb.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IReportUserFb extends Document {
  name: string;
  keyword: string;
  column: string[];
}

const ReportUserFbSchema: Schema<IReportUserFb> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  keyword: {
    type: String,
    required: true,
    trim: true,
  },
  column: {
    type: [String],
    required: true,
    default: [],
  },
});

const ReportUserFbModel: Model<IReportUserFb> =
  mongoose.models.ReportUserFb || mongoose.model<IReportUserFb>("ReportUserFb", ReportUserFbSchema);

export default ReportUserFbModel;
