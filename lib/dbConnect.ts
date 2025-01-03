import mongoose from "mongoose";
export async function dbConnect() {

  //check if moongose is already connected
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
}