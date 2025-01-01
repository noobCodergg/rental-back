const express=require('express');
const {getUser, updateRating, fetchAllUsers, updateUser, updateIsAvailable, getUsers, deleteUser, postSuggestion}=require('../Controller/UserController')

const router=express.Router();

router.get('/getUser/:id',getUser)
router.put('/updaterating/:id',updateRating)
router.get('/fetchallusers',fetchAllUsers)
router.put('/updateuser/:id',updateUser)
router.put('/updateisavailable/:userId',updateIsAvailable)
router.get('/getusers',getUsers)
router.delete('/deleteuser/:userId',deleteUser)
router.post('/postsuggestion',postSuggestion)
module.exports=router