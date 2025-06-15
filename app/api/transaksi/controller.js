const { check, validationResult } = require("express-validator");
const Transaksi = require("../transaksi/models");
const Produk = require("../produk/models");
const Pembayaran = require("../pembayaran/models");

// Relasi antar model
Transaksi.belongsTo(Produk, { foreignKey: "idProduk" });
Transaksi.belongsTo(Pembayaran, { foreignKey: "idMetodePembayaran" });

// ✅ Validasi input transaksi
const validasiTransaksi = [
  check("idMetodePembayaran")
    .notEmpty().withMessage("Metode pembayaran wajib diisi")
    .isInt().withMessage("Metode pembayaran harus berupa angka"),
  check("idProduk")
    .notEmpty().withMessage("Produk wajib dipilih")
    .isInt().withMessage("Produk harus berupa angka"),
  check("jumlahBeli")
    .notEmpty().withMessage("Jumlah beli wajib diisi")
    .isInt({ min: 1 }).withMessage("Jumlah beli minimal 1")
];

// ✅ Membuat transaksi
const createTransaksi = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { idMetodePembayaran, idProduk, jumlahBeli } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const produk = await Produk.findByPk(idProduk);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    if (jumlahBeli > produk.stok) {
      return res.status(400).json({ message: "Stok produk tidak mencukupi" });
    }

    const total = produk.harga * jumlahBeli;

    const transaksi = await Transaksi.create({
      idMetodePembayaran,
      idProduk,
      jumlahBeli,
      total,
      userId
    });

    await produk.update({ stok: produk.stok - jumlahBeli });

    res.status(201).json({
      status: 201,
      message: "Transaksi berhasil dibuat",
      data: transaksi
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat transaksi",
      error: error.message
    });
  }
};

// ✅ Menampilkan semua transaksi milik user
const getAllTransaksi = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const transaksi = await Transaksi.findAll({
      where: { userId },
      include: [
        { model: Produk, attributes: ["namaProduk", "harga"] },
        { model: Pembayaran, attributes: ["metodePembayaran"] }
      ]
    });

    res.status(200).json({
      status: 200,
      message: "Daftar transaksi berhasil diambil",
      data: transaksi
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil daftar transaksi",
      error: error.message
    });
  }
};

// ✅ Mengupdate transaksi
const updateTransaksi = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { id } = req.params;
    const { idMetodePembayaran, idProduk, jumlahBeli } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const transaksi = await Transaksi.findOne({ where: { id, userId } });
    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan atau bukan milik user ini" });
    }

    const metode = await Pembayaran.findByPk(idMetodePembayaran);
    if (!metode) {
      return res.status(404).json({ message: "Metode pembayaran tidak ditemukan" });
    }

    const produk = await Produk.findByPk(idProduk);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const total = produk.harga * jumlahBeli;

    await transaksi.update({
      idMetodePembayaran,
      idProduk,
      jumlahBeli,
      total
    });

    res.status(200).json({
      message: "Transaksi berhasil diupdate",
      data: transaksi
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal update transaksi", error: error.message });
  }
};

// ✅ Menghapus transaksi
const deleteTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const transaksi = await Transaksi.findOne({ where: { id, userId } });
    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan atau bukan milik user ini" });
    }

    const produk = await Produk.findByPk(transaksi.idProduk);
    if (produk) {
      await produk.update({ stok: produk.stok + transaksi.jumlahBeli });
    }

    await transaksi.destroy();

    res.status(200).json({
      status: 200,
      message: "Transaksi berhasil dihapus"
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus transaksi",
      error: error.message
    });
  }
};

module.exports = {
  validasiTransaksi,
  createTransaksi,
  getAllTransaksi,
  updateTransaksi,
  deleteTransaksi
};
