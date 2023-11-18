import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Server connected to DB: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to DB: ${error}`);
    }
};

export default connectDB;
