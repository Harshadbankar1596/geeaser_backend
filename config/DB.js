import mongoose from "mongoose";

async function ConnectDB(url) {
  try {
    await mongoose.connect(url);
    console.log("DB Connected:", url);
  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    throw error;
  }
}

export default ConnectDB;
