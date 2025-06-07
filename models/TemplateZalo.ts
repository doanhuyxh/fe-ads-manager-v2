// models/TemplateZalo.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITemplateZalo extends Document {
  _id: string;
  name:string;
  content:string;
}

const TemplateZaloSchema: Schema<ITemplateZalo> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
});

const TemplateZaloModel: Model<ITemplateZalo> =
  mongoose.models.TemplateZalo || mongoose.model<ITemplateZalo>("TemplateZalo", TemplateZaloSchema);

export default TemplateZaloModel;
