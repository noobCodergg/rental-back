const mongoose = require("mongoose");

const timeSchema = new mongoose.Schema({
  driverId: String,
  userId:String,
  time:String,
  route:String,
  rideStatus:Boolean
});

module.exports = mongoose.model("times", timeSchema);