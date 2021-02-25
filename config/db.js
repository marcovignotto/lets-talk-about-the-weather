const mongoose = require("mongoose");
const config = require("config");
const db = process.env.MONGODB_URI || config.get("mongoDb.URI");

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(db, dbOptions);
    console.log("MongoDB connected...");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
