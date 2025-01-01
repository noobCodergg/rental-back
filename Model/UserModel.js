const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email:String,
  password:String,
  confirm_password:String,
  role: String,
  phone:String,
  profile_photo:String,
  cover_photo:String,
  gender:String,
  religion:String,
  bio:String,
  rating:Number,
  rating_score:Number,
  total_rating:Number,
  subscriptionId:String,
  subscriptionCreated:Date,
  isAvailable:Boolean,
  nid:String
});

module.exports = mongoose.model("users", userSchema);