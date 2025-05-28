// models/user.ts
import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id:ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  companyIds: [string];
  role: string;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,      
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  companyIds: {
    type: [String],
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
