const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  time: { type: Date, default: Date.now }, 
  roomId: String,
  isRead: Boolean,
  name:String
});

module.exports = mongoose.model("chats", chatSchema);
