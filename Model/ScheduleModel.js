const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  driverId: String,
  userId:String,
  time:String,
  rideStatus:Boolean,
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("schedules", scheduleSchema);