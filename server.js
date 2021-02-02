const express = require("express");
const connectDB = require("./config/db.js");

const app = express();

// get users

// connect Mongo DB
connectDB();
// const populateDbWeather = require("./src/components/populateDbWeather");
// connectDB().then((res) => populateDbWeather());

// get weather

// Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) =>
  res.send({ msg: `Let's talk about the weather API` })
);

// routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/general", require("./routes/general"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
