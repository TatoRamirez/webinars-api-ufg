const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    trim: true,
  },
  tokenparent: {
    type: String,
    trim: true,
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
  birthdate: {
    type: Date,
    trim: true,
  },
  personalemail: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  institutionorigin: {
    type: String,
    trim: true,
  },
  academiclevel: {
    type: String,
    trim: true,
  },
  universitycareerinterest: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
    trim: true,
  },
  password: {
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
    default: true,
  },
  terms: {
    type: Boolean,
    default: false,
  },
  interested: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Usuarios", UsersSchema);