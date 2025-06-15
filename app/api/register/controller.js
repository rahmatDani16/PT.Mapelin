const User = require("../register/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validasi sederhana
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // Jangan hash password di sini karena model sudah menangani
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registrasi error:", error);
    res.status(500).json({ message: "Registrasi gagal", error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Alamat email salah " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login gagal", error: error.message });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "createdAt", "updatedAt"],
    });

    res.status(200).json({
      message: "Berhasil mengambil data semua user",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data user",
      error: error.message,
    });
  }
};
// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email", "createdAt", "updatedAt"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil user", error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    // Bandingkan ID dari token dan dari URL
    if (parseInt(req.user.idUser) !== parseInt(req.params.id)) {
      return res.status(403).json({ message: "Akses ditolak. Tidak bisa update user lain." });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Update data sesuai yang dikirim
    const { username, email, password } = req.body;

    await user.update({ username, email, password });

    return res.status(200).json({
      message: "User berhasil diupdate",
      data: user
    });
  } catch (error) {
    return res.status(500).json({ message: "Gagal update user", error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  if (parseInt(req.user.idUser) !== parseInt(req.params.id)) {
    return res.status(403).json({ message: "Akses ditolak. Tidak bisa hapus user lain." });
  }

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    await user.destroy();
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user", error: error.message });
  }
};



module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
