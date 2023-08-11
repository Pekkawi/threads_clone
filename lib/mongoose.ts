import mongoose from "mongoose";

let isConnected = false; // variable to check connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); //prevent unknown field queries

  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL NOT FOUND");
  if (isConnected) return console.log("Connected");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("connected to MONGODB");
  } catch (err) {
    console.log(err);
  }
};
