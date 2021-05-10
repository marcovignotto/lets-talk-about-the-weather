const mongoose = require("mongoose");

/**
 * @description model for Backend Users
 */

const BackendUserSchema = mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("backendUser", BackendUserSchema);
