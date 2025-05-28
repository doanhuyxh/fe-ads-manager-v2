// models/company.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  fbToken: string;
  idPage: string[];
}

const CompanySchema: Schema<ICompany> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fbToken: {
    type: String,
    required: true,
  },
  idPage: {
    type: [String],
    required: true,
    default: [],
  },
});

const CompanyModel: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default CompanyModel;
