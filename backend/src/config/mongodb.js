import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ DB CONNECTED");
    });

    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error("MONGODB_URL is not defined in environment");
    }

    // Do not append extra path here — the full connection string should include the DB name and options
    await mongoose.connect(uri, {
      // recommended options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // serverSelectionTimeoutMS controls how long the driver will try to connect before timing out
      serverSelectionTimeoutMS: 10000,
    });
  } catch (err) {
    console.error(
      "❌ Failed to connect to MongoDB in config/mongodb.js:",
      err.message || err
    );
    // rethrow so callers can handle exit/retry
    throw err;
  }
};

export default connectDB;
