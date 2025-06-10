// models/Log.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILog extends Document {
    _id: string;
    time: string;
    level:string;
    message: string;
}

const LogSchema: Schema<ILog> = new mongoose.Schema({
    time: {
        type: String,
        required: true,
        trim: true,
    },    
    level: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
    },

});

const LogModel: Model<ILog> =
    mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);

export default LogModel;
