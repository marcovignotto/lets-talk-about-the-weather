const express = require("express");
const connectDB = require("./config/db.js");
const config = require("config");

const app = express();

// connect Mongo DB
connectDB();

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

// is production

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   );
// }

const PORT = process.env.PORT || config.get("server.PORT");

app.listen(PORT, () => console.log(`Server started`));
