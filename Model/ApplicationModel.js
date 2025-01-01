const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    userId:String,
    landlordid:String,
    propertyid:String,
    applicationBody:String,
    applicationStatus:String,
    applicantName:String,
    propertyName:String
});

module.exports = mongoose.model("applications", applicationSchema);