const express = require("express");
const connectDB = require("./config/db.js");

var path = require("path");

const cors = require("./middleware/cors");

const app = express();

/**
 * @desc PORT
 */
const PORT = process.env.PORT;

/**
 * @desc Custom middleware
 */
app.use(cors);

// connect Mongo DB
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/users", require("./routes/users"));
app.use("/api/weatherusers", require("./routes/weatherUsers"));
app.use("/api/auth", require("./routes/auth"));

// HTML ADMIN
app.use("/admin", express.static(path.join(__dirname, "admin/dist")));
app.use("/", express.static(path.join(__dirname, "lib/dist")));

/**
 * @desc Global error handler middleware
 */

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  /**
   * @desc default 500
   */
  res
    .status(err.status || 500)
    // send the rest to the user
    .send({
      success: false,
      message: "Somenthig went wrong!",
      status: err.status,
      error: err.message,
    });
});

app.listen(PORT, () => console.log(`Server started`));
