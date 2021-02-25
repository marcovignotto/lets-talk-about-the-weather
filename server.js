const express = require("express");
const connectDB = require("./config/db.js");

const auth = require("./middleware/auth");

var path = require("path");

var cors = require("cors");

const config = require("config");

const app = express();

// REMOVE AT THE END
const populateDbWeather = require("./src/components/populateDbWeather");
// connectDB().then((res) => populateDbWeather());

// connect Mongo DB
connectDB();

app.use(cors());

// Middleware
app.use(express.json({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/users", require("./routes/users"));
app.use("/api/weatherusers", require("./routes/weatherUsers"));
app.use("/api/auth", require("./routes/auth"));

// HTML ADMIN
app.use("/admin", express.static(path.join(__dirname, "admin")));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started`));
