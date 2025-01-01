
const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  price:Number,
  time: { type: Date, default: Date.now },
});
module.exports = mongoose.model("incomes", incomeSchema);