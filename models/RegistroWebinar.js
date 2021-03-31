const mongoose = require("mongoose");

const Webinar = mongoose.Schema(
  {
    codeWebinar: {
      type: String,
      trim: true,
      required: true,
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
  },
  { _id: false }
);

const RegistroWebinarSchema = mongoose.Schema({
  token: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  personalemail: {
    type: String,
    required: true,
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
  Webinars: [Webinar],
});

module.exports = mongoose.model("RegistrosWebinar", RegistroWebinarSchema);
