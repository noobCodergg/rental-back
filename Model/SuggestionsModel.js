const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  userId:String,
  id:String,
  content:String,
  type:String
});

module.exports = mongoose.model("suggestions", suggestionSchema);