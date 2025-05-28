import mongoose, { Mongoose } from 'mongoose';
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const MONGODB_URI: string = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
declare global {
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}
if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}
async function connectToDB(): Promise<Mongoose> {
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }
    if (!global.mongoose.promise) {
        global.mongoose.promise = mongoose.connect(MONGODB_URI!, {
            bufferCommands: true,
            dbName:"add-manager-v2",
        });
    }
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
}

export default connectToDB;