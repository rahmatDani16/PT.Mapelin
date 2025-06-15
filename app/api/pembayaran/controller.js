const { check, validationResult } = require("express-validator");
const Pembayaran = require("./models");
const ProfileToko = require("../profilToko/models");

// Validasi input pembayaran
const validasiPembayaran = [
  check("metodePembayaran")
    .notEmpty().withMessage("Metode pembayaran wajib diisi")
    .isIn(["qris", "cash", "bank"]).withMessage("Metode pembayaran tidak valid")
];

// Membuat metode pembayaran
const createPembayaran = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { metodePembayaran } = req.body;
    const idProfilToko = req.user?.idProfilToko || req.body.idProfilToko;

    if (!idProfilToko) {
      return res.status(400).json({ message: "ID profil toko tidak ditemukan" });
    }

    const pembayaran = await Pembayaran.create({
      metodePembayaran,
      idProfilToko
    });

    res.status(201).json({
      status: 201,
      message: "Metode pembayaran berhasil ditambahkan",
      data: pembayaran
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat metode pembayaran",
      error: error.message
    });
  }
};

// Mengambil semua metode pembayaran milik user
const getAllPembayaran = async (req, res) => {
  try {
    const idProfilToko = req.user?.idProfilToko || req.query.idProfilToko;

    if (!idProfilToko) {
      return res.status(400).json({ message: "ID profil toko tidak ditemukan" });
    }

    const data = await Pembayaran.findAll({
      where: { idProfilToko }
    });

    res.status(200).json({
      status: 200,
      message: "Daftar metode pembayaran",
      data
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil metode pembayaran",
      error: error.message
    });
  }
};

// Mengupdate metode pembayaran milik user
const updatePembayaran = async (req, res) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    // Ambil ID dari URL dan body
    const { id } = req.params;
    const { metodePembayaran } = req.body;

    // Ambil ID profil toko dari token (middleware autentikasi harus isi req.user.idProfilToko)
    const idProfilToko = req.user?.idProfilToko;
    // Cari pembayaran berdasarkan ID
    const pembayaran = await Pembayaran.findByPk(id);

    if (!pembayaran) {
      return res.status(404).json({
        message: "Metode pembayaran tidak ditemukan"
      });
    }


    // Bandingkan kepemilikan
    if (pembayaran.idProfilToko !== idProfilToko) {
      return res.status(403).json({
        message: "Metode pembayaran bukan milik toko ini"
      });
    }

    // Update data
    await pembayaran.update({
      metodePembayaran: metodePembayaran.toLowerCase()
    });

    return res.status(200).json({
      status: 200,
      message: "Metode pembayaran berhasil diperbarui untuk toko Anda",
      data: pembayaran
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengupdate metode pembayaran",
      error: error.message
    });
  }
};
// Menghapus metode pembayaran milik user
const deletePembayaran = async (req, res) => {
  try {
    const { id } = req.params;
    const idProfilToko = req.user?.idProfilToko || req.query.idProfilToko;

    const pembayaran = await Pembayaran.findOne({
      where: { id, idProfilToko }
    });

    if (!pembayaran) {
      return res.status(404).json({ message: "Metode pembayaran tidak ditemukan atau bukan milik toko ini" });
    }

    await pembayaran.destroy();

    res.status(200).json({
      status: 200,
      message: "Metode pembayaran berhasil dihapus"
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus metode pembayaran",
      error: error.message
    });
  }
};

module.exports = {
  validasiPembayaran,
  createPembayaran,
  getAllPembayaran,
  updatePembayaran,
  deletePembayaran
};
