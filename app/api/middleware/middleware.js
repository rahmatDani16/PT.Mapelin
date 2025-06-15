const jwt = require("jsonwebtoken");
const User = require("../register/models");
const ProfileToko = require("../profilToko/models");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    // Ambil profil toko jika ada
    const profile = await ProfileToko.findOne({
      where: { userId: user.id }
    });

    // Logging tambahan untuk debug
    console.log("✅ Token valid - User ID:", user.id);
    if (profile) {
      console.log("✅ Profil Toko ID:", profile.id);
    } else {
      console.log("⚠️ Profil toko tidak ditemukan untuk user ini");
    }

    // Tambahan: isi id agar aman digunakan jika req.user.id dipakai di controller
    req.user = {
      idUser: user.id,
      id: user.id, // ✅ Tambahan penting agar req.user.id tidak undefined
      idProfilToko: profile?.id || null,
      username: user.username || null,
      email: user.email || null
    };

    next();
  } catch (error) {
    console.log("❌ Token error:", error.message);
    return res.status(401).json({ message: "Token tidak valid", error: error.message });
  }
};

module.exports = verifyToken;
