import mongoose from "mongoose";
import { MONGO_URI } from "./constant.js";

export const connectDb = async () => {
  try {
    await mongoose
      .connect(MONGO_URI)
      .then(() => console.log(`Db Connected Successfully`))
      .catch((error) => console.log(`Error Occured from Db, ${error}`));
  } catch (error) {
    throw new Error(error.message);
  }
};
