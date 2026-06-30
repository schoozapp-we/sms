import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  if (!global.__mongooseConn) {
    global.__mongooseConn = mongoose.connect(uri, {
      autoIndex: true
    });
  }

  return global.__mongooseConn;
}
