const jwt = require('jsonwebtoken')

exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
   return res.status(500).json(false);
  }

  try {
    const decoded=await jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded
    next();
  } catch (err) {
   return res.status(500).json(false);
  }
};
