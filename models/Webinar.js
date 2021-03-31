const mongoose = require("mongoose");

const WebinarSchema = mongoose.Schema({
  codeWebinar: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  information: {
    type: String,
    trim: true,
  },
  eventdate: {
    type: Date,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  createdate: {
    type: Date,
    default: Date.now(),
  },
  modifieddate: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Webinars", WebinarSchema);