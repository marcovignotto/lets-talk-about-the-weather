const express = require("express");
const connectDB = require("./config/db.js");
const populateDbWeather = require("./src/components/populateDbWeather");

const app = express();

// get users

// connect Mongo DB
connectDB();
// connectDB().then((res) => populateDbWeather());

// get weather

// init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) =>
  res.send({ msg: `Let's talk about the weather API` })
);

// routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/general", require("./routes/general"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
