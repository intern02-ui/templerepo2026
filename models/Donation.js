const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    default: ""
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentId: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("Donation", donationSchema);
