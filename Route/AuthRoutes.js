const express=require('express')

const {register,login, auth,verifyOtp, logout}=require('../Controller/AuthController')
const {verifyToken} =require('../Middleware/Auth')

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.get('/auth',verifyToken,auth)
router.post('/verifyOtp',verifyOtp)
router.post('/logout',logout)

module.exports = router;