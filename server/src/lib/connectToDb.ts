import 'dotenv/config'
import mongoose from "mongoose";

export const connectMongoDb = async () => {
    try {
        if (mongoose?.connections[0].readyState) return
        const { connection } = await mongoose.connect(process.env.MONGO_URL as string)
        console.log(`Connected To Database: ${connection.name}`);

    } catch (error) {
        throw new Error("Error Connecting To Database")
    }
}

export default connectMongoDb 