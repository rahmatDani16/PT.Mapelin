const { check, validationResult } = require("express-validator");
const ProfileToko = require("../profilToko/models");

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

// Membuat Profil Toko 
const createProfileToko = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password, alamat, namaToko, noHp } = req.body;

    const profile = await ProfileToko.create({
      email,
      password,
      alamat,
      namaToko,
      noHp
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

// Mengambil profil toko berdasarkan user login
const getAllProfileToko = async (req, res) => {
  try {
    const profile = await ProfileToko.findOne({
      where: { id: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile toko tidak ditemukan"
      });
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

// Mengupdate profil toko 
const updateProfileToko = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const profile = await ProfileToko.findOne({
      where: { id: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile toko tidak ditemukan"
      });
    }

    const { email, password, alamat, namaToko, noHp } = req.body;

    await profile.update({
      email,
      password,
      alamat,
      namaToko,
      noHp
    });

    res.status(200).json({
      status: 200,
      message: "Profile berhasil diperbarui",
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
    const profile = await ProfileToko.findOne({
      where: { id: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profil toko tidak ditemukan"
      });
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
  getAllProfileToko,
  updateProfileToko,
  deleteProfileToko
};
