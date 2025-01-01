const express=require('express');
const {postSubscription, getSubscription, updateUserSubscription,validation, getAvailableDriver, postIncome, updatedSubscription}=require('../Controller/SubscriptionController')

const router=express.Router();

router.post('/postsubscription',postSubscription)
router.get('/getsubscription',getSubscription)
router.put('/updatesubscription',updateUserSubscription)
router.get('/validation/:userId',validation)
router.get('/getavailabledriver/:userId',getAvailableDriver)
router.post('/postincome',postIncome)
router.put('/update/:id',updatedSubscription)
module.exports=router