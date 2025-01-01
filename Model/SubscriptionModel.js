const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    subscriptionName: String,
    subscriptionDuration: Number,
    rideAvailabilityFrom: String,
    rideAvailabilityTo: String,
    areaCoverage: String,
    price: Number,
    otherFeatures: String,
});

module.exports = mongoose.model("subscriptions", subscriptionSchema);