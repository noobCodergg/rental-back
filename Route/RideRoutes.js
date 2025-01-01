const express=require('express');
const { postRide, updateAvailability, getRequest, updateIsRead, updateRideStatus, postScedule, getSchedule, updateTimeStatus, postHistory, getRideDetails } = require('../Controller/RideController');



const router=express.Router();

router.post('/postride',postRide)
router.put('/updateavailability/:id',updateAvailability)
router.get('/getrequest/:userId',getRequest)
router.put('/updateisread/:id',updateIsRead)
router.put('/updateridestatus/:id',updateRideStatus)
router.post('/posttime',postScedule)
router.get('/getschedule/:userId',getSchedule)
router.put('/updatetimestatus/:id',updateTimeStatus)
router.post('/posthistory',postHistory)
router.get('/getriderdetail/:userId',getRideDetails)


module.exports=router