const express = require("express");
const { earningSubscription, earningRental, earningRentalUser, getsugg } = require("../Controller/AdminController");


const router = express.Router();

router.get("/earningsubs", earningSubscription);
router.get('/earningrental',earningRental)
router.get('/earningrentaluser/:userId',earningRentalUser)
router.get('/getsugg',getsugg)
module.exports = router;
