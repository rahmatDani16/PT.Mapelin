const { check, validationResult } = require("express-validator");
const Kategori = require("./models");

// Validasi input
const validasi = [
  check("namaKategori").notEmpty().withMessage("Nama kategori tidak boleh kosong")
];

// Tambah kategori
const createKategori = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const { namaKategori } = req.body;

    // Buat kategori hanya dengan field yang diperlukan
    const kategori = await Kategori.create({ namaKategori });

    res.status(201).json({
      status: 201,
      message: "Kategori berhasil ditambah",
      data: kategori
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal Menambah Kategori",
      error: error.message
    });
  }
};

// Ambil semua kategori
const getAllKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findAll();
    res.status(200).json({
      status: 200,
      message: "Semua kategori",
      data: kategori
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil kategori",
      error: error.message
    });
  }
};

// Ambil kategori berdasarkan ID
const getKategoriById = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.status(200).json({
      status: 200,
      message: "Detail kategori",
      data: kategori
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil kategori",
      error: error.message
    });
  }
};

// Update kategori
const updateKategori = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    await kategori.update({ namaKategori: req.body.namaKategori });

    res.status(200).json({
      status: 200,
      message: "Kategori berhasil diperbarui",
      data: kategori
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal update kategori",
      error: error.message
    });
  }
};

// Hapus kategori
const deleteKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    await kategori.destroy();

    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: error.message
    });
  }
};

module.exports = {
  validasi,
  createKategori,
  getAllKategori,
  getKategoriById,
  updateKategori,
  deleteKategori
};
