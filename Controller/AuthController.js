const userModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "muntasirniloy2002@gmail.com",
    pass: "ugjk yeyx jdgb patm",
  },
});

const otpStore = {};

exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    confirm_password,
    role,
    phone,
    profile_photo,
    cover_photo,
    gender,
    religion,
    bio,
    rating,
    rating_score,
    total_rating,
    subscriptionId,
    subscriptionCreated,
    nid,
  } = req.body;

  
  if (password.length < 8) {
    return res.status(500).json("Password must be at least 8 characters long");
  }

  if (password !== confirm_password) {
    return res.status(500).json("Passwords do not match");
  }

  const user = await userModel.findOne({ email });

  if (user) {
    return res.status(500).json("User already exists");
  }

 const getUser=await userModel.findOne({nid})

 if(getUser){
  return res.status(500).json("Try with new Nid");
 }

  const hashPassword = await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT)
  );

  try {
    await userModel.create({
      name,
      email,
      password: hashPassword,
      role,
      phone,
      profile_photo,
      cover_photo,
      gender,
      religion,
      bio,
      rating,
      rating_score,
      total_rating,
      subscriptionId,
      subscriptionCreated,
      isAvailable: true,
      nid
    });

    return res.status(201).json("User created successfully");
  } catch (err) {
    res.status(500).json("Error creating user");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(500).json("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(500).json("Wrong password");
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    otpStore[email] = { otp, otpExpires };

    res.cookie("tempEmail", email, { httpOnly: true, secure: true });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Your OTP Code",
      html: `
        <h1>Login OTP</h1>
        <p>Hello ${user.name},</p>
        <p>Your OTP code is <strong>${otp}</strong>.</p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json("OTP sent to your email");
  } catch (err) {
    console.error(err);
    res.status(500).json("Error logging in user");
  }
};

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  const email = req.cookies.tempEmail;

  if (!email) {
    return res.status(400).json("Email is not available. Please log in again.");
  }

  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res.status(400).json("OTP expired or invalid");
  }

  const { otp: storedOtp, otpExpires } = storedOtpData;

  if (Date.now() > otpExpires) {
    delete otpStore[email];
    return res.status(400).json("OTP has expired");
  }

  if (otp !== storedOtp) {
    return res.status(400).json("Invalid OTP");
  }

  const user = await userModel.findOne({ email });

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  delete otpStore[email];

  res.clearCookie("tempEmail");
  res.cookie("token", token, { httpOnly: true, secure: true });

  return res.status(200).json("OTP verified successfully");
};

exports.auth = async (req, res) => {
  try {
    return res.json({
      success: true,
      role: req.user.role,
      id: req.user.id,
      name: req.user.name,
    });
  } catch (err) {
    res.status(500).json({ success: false, role: "" });
  }
};

exports.logout=async(req,res)=>{
  try{
    res.clearCookie("token");
    return res.status(200).json("LogOut Successfully")
  }catch(err){
    res.status(500).json("Error logging out");
  }
}
