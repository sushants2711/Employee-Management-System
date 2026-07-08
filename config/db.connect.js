import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect()
            .then(() => console.log(`Db Connected Successfully`))
            .catch((error) => console.log(`Error Occured from Db, ${error}`));
    } catch (error) {
        throw new Error(error.message);
    }
}