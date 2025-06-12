const { check, validationResult } = require("express-validator");
const Pembayaran = require("./models");

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

    const pembayaran = await Pembayaran.create({ metodePembayaran });

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

// Mengambil semua metode pembayaran
const getAllPembayaran = async (req, res) => {
  try {
    const data = await Pembayaran.findAll();
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

// Mengupdate metode pembayaran
const updatePembayaran = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { id } = req.params;
    const { metodePembayaran } = req.body;

    const pembayaran = await Pembayaran.findByPk(id);
    if (!pembayaran) {
      return res.status(404).json({
        message: "Metode pembayaran tidak ditemukan"
      });
    }

    await pembayaran.update({ metodePembayaran: metodePembayaran.toLowerCase() });

    res.status(200).json({
      status: 200,
      message: "Metode pembayaran berhasil diperbarui",
      data: pembayaran
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate metode pembayaran",
      error: error.message
    });
  }
};


// Menghapus metode pembayaran
const deletePembayaran = async (req, res) => {
  try {
    const { id } = req.params;

    const pembayaran = await Pembayaran.findOne({ where: { id } });
    if (!pembayaran) {
      return res.status(404).json({ message: "Metode pembayaran tidak ditemukan" });
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
