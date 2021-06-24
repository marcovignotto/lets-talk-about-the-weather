const express = require("express");
const connectDB = require("./config/db.js");

var path = require("path");

// var cors = require("cors");

const app = express();

// connect Mongo DB
connectDB();

// app.use(cors());

// Middleware
app.use(express.json({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5000/");
  next();
});

// routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/users", require("./routes/users"));
app.use("/api/weatherusers", require("./routes/weatherUsers"));
app.use("/api/auth", require("./routes/auth"));

// HTML ADMIN
app.use("/admin", express.static(path.join(__dirname, "admin/dist")));
app.use("/", express.static(path.join(__dirname, "lib/dist")));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started`));
