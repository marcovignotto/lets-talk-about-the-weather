const express = require("express");
const connectDB = require("./config/db.js");

const auth = require("./middleware/auth");
const basicAuth = require("express-basic-auth");

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

app.get("/", (req, res) =>
  res.send({ msg: `Let's talk about the weather API` })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const adminAuthKeys = {
  admin: "123456",
};

// routes

app.use("/api/locations", require("./routes/locations"));
app.use("/api/general", require("./routes/general"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

// HTML ADMIN
app.use("/admin", express.static(path.join(__dirname, "admin")));
// app.use("/admin/*", auth, express.static(path.join(__dirname, "admin")));

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   );
// }

const PORT = process.env.PORT || config.get("server.PORT");

app.listen(PORT, () => console.log(`Server started`));
