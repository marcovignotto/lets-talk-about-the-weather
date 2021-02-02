const express = require("express");
const connectDB = require("./config/db.js");
const config = require("config");

const app = express();

// connect Mongo DB
connectDB();
const populateDbWeather = require("./src/components/populateDbWeather");
// connectDB().then((res) => populateDbWeather());
const path = require("path");

// get weather

// init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) =>
  res.send({ msg: `Let's talk about the weather API` })
);

// routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/general", require("./routes/general"));

// is production

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   );
// }

const PORT = process.env.PORT || config.get("server.PORT");

app.listen(PORT, () => console.log(`Server started`));
