import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const uri = process.env.URI;
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}
