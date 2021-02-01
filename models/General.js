const mongoose = require("mongoose");

const GeneralSchema = mongoose.Schema({
  //   task: {
  //     type: String,
  //     require: true,
  //   },
  //   priority: {
  //     type: String,
  //     require: true,
  //   },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("general", GeneralSchema);
