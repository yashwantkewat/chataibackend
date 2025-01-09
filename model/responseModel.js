// models/responseModel.js
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  userInput: { type: String, required: true },
  aiResponse: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
