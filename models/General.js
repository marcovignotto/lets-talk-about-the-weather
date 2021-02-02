const mongoose = require("mongoose");

const GeneralSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("general", GeneralSchema);
