// app/api/middleware/middleware.js
const jwt = require("jsonwebtoken");
const User = require("../register/models");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Akses ditolak, token tidak tersedia atau format salah",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token tidak valid",
      error: err.message,
    });
  }
};

module.exports = verifyToken;
