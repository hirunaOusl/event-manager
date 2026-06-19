// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        process.exit(1);
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        mongoose.set("strictQuery", true);

        const conn = await mongoose.connect(uri, {
            // Mongoose 8 no longer needs useNewUrlParser/useUnifiedTopology,
            // they're defaults now, kept here as no-ops for clarity if downgrading.
        });

        console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err.message);
        });
    } catch (err) {
        console.error(`Failed to connect to MongoDB: ${err.message}`);
        process.exit(1);
    }

};

module.exports = connectDB;