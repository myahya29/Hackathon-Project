// config/db.js
// Handles the MongoDB connection using Mongoose.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in your .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure if DB connection fails — the app can't run without it
    process.exit(1);
  }
};

// Log runtime connection issues that happen after the initial connect
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

module.exports = connectDB;
