import { MONGODB_URI } from "@/config/env";
import mongoose from "mongoose";

const url = MONGODB_URI
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("error while connecting to mongodb", error);
  }
};

export default connectDB;