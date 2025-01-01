const express=require('express')
const {postChat, getChat, getUser,getUserName, markMessagesAsRead, getChatHistory}=require('../Controller/ChatController');


const router=express.Router();

router.post('/postchat',postChat)
router.get('/getchat/:id/:userId',getChat)
router.get('/getuser/:userId',getUser)
router.post('/getusername',getUserName)
router.put('/markmessagesasread/:roomId',markMessagesAsRead)
router.get('/getchathistory/:userId',getChatHistory)

module.exports=router