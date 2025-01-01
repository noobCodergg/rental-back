const express=require('express');

const {createProperty, getAllProperties, getPropertyById, getProprtyByUserID, updateProperty, deleteProperty, updatePropertyStatus} =require('../Controller/PostController')

const router=express.Router();

router.post('/createproperty',createProperty)
router.get('/getallproperties',getAllProperties)
router.get('/getpropertybyid/:id',getPropertyById)
router.get('/getpropertybyuserid/:userId',getProprtyByUserID)
router.put('/updateproperty/:id',updateProperty)
router.delete('/deleteproperty/:id',deleteProperty)
router.put('/updatepropertystatus/:propertyid',updatePropertyStatus)

module.exports=router