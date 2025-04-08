const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "contacted", "interested", "not-interested", "callback"],
    default: "pending",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  callResponse: {
    type: String,
    enum: [
      "discussed",
      "callback",
      "interested",
      "busy",
      "rnr",
      "switched_off",
      null,
    ],
    default: null,
  },
  callNotes: {
    type: String,
    default: "",
  },
  lastCallDate: {
    type: Date,
    default: null,
  },
  nextCallDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lead", leadSchema);
