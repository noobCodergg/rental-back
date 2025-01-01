const express = require("express");
const {
  postApplication,
  getMyApplications,
  getApplications,
  updateApplication,
} = require("../Controller/ApplicationController");

const router = express.Router();

router.post("/postapplication", postApplication);
router.get("/getmyapplication/:userId", getMyApplications);
router.get("/getapplication/:userId", getApplications);
router.put("/updateapplication/:id", updateApplication);
module.exports = router;
