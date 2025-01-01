
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  propertyName: String,
  propertySize: Number,
  roomNumber: Number,
  location: String,
  price: Number,
  category: String,
  rentalDate: String,
  images: [String],
  landlord_id:String,
  status:Boolean,
  description:String
});
module.exports = mongoose.model("rentals", propertySchema);

