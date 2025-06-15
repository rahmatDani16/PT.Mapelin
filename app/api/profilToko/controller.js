const { check, validationResult } = require("express-validator");
const ProfileToko = require("../profilToko/models");
const bcrypt = require("bcryptjs");


// Validasi input profile toko 
const validation = [
  check("email")
    .notEmpty().withMessage("Email tidak boleh kosong")
    .isEmail().withMessage("Format email tidak valid"),
  check("password")
    .notEmpty().withMessage("Password tidak boleh kosong")
    .isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
  check("alamat")
    .notEmpty().withMessage("Alamat tidak boleh kosong"),
  check("namaToko")
    .notEmpty().withMessage("Nama toko tidak boleh kosong"),
  check("noHp")
    .notEmpty().withMessage("Nomor HP tidak boleh kosong")
    .isMobilePhone().withMessage("Format nomor HP tidak valid")
];

// Membuat Profil Toko (user hanya bisa buat 1 profil)
const createProfileToko = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const existing = await ProfileToko.findOne({ where: { userId: req.user.id } });
    if (existing) {
      return res.status(400).json({ message: "Profil toko sudah ada" });
    }

    const { email, password, alamat, namaToko, noHp } = req.body;

    const profile = await ProfileToko.create({
      email,
      password,
      alamat,
      namaToko,
      noHp,
      userId: req.user.id
    });

    res.status(201).json({
      status: 201,
      message: "Profil toko berhasil dibuat",
      data: profile
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal membuat profile",
      error: error.message
    });
  }
};

// Mendapatkan Profil Toko berdasarkan user yang login
const getProfileToko = async (req, res) => {
  try {
    const profile = await ProfileToko.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile toko tidak ditemukan" });
    }

    res.status(200).json({
      status: 200,
      message: "Detail Profile toko",
      data: profile
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil data profile",
      error: error.message
    });
  }
};

// Mengupdate profil toko berdasarkan user login
const updateProfileToko = async (req, res) => {
  try {
    // Validasi dari express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { id } = req.params; // Ambil id dari URL
    const { email, password, alamat, namaToko, noHp } = req.body;

    // Cari profil berdasarkan ID dan pastikan dimiliki oleh user yang sedang login
    const profile = await ProfileToko.findOne({
      where: {
        id,
        userId: req.user.id, // agar user hanya bisa update miliknya sendiri
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Profil toko tidak ditemukan atau bukan milik user ini" });
    }

    // Hash password jika diberikan
    let hashedPassword = profile.password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update profil toko
    await profile.update({
      email,
      password: hashedPassword,
      alamat,
      namaToko,
      noHp
    });

    res.status(200).json({
      status: 200,
      message: "Profil toko berhasil diperbarui",
      data: profile
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal memperbarui profil toko",
      error: error.message
    });
  }
};

// Menghapus profil toko
const deleteProfileToko = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ProfileToko.findByPk(id);

    if (!profile) {
      return res.status(404).json({ message: "Profil toko tidak ditemukan" });
    }

    // Cek apakah user yang sedang login adalah pemilik profil tersebut
    if (profile.userId !== req.user.id) {
      return res.status(403).json({ message: "Akses ditolak. Bukan pemilik profil ini." });
    }

    await profile.destroy();

    res.status(200).json({
      status: 200,
      message: "Profil toko berhasil dihapus"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal menghapus profil toko",
      error: error.message
    });
  }
};

module.exports = {
  validation,
  createProfileToko,
  getProfileToko,
  updateProfileToko,
  deleteProfileToko
};
