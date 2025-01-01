const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  name:String,
  sender: String,
  receiver: String,
  time: { type: Date, default: Date.now }, 
  isRead: Boolean,
  rideStatus:String
});

module.exports = mongoose.model("rides", rideSchema);