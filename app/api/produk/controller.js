const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs/promises");
const Produk = require("../produk/models");

//validasi input produk 
const validasi = [
  check("namaProduk")
    .notEmpty().withMessage("Nama produk tidak boleh kosong"),

  check("harga")
    .notEmpty().withMessage("Harga tidak boleh kosong")
    .isNumeric().withMessage("Harga harus berupa angka"),

  check("stok")
    .notEmpty().withMessage("Stok tidak boleh kosong")
    .isNumeric().withMessage("Stok harus berupa angka"),

  check("kategoriId")
    .notEmpty().withMessage("Kategori tidak boleh kosong"),

  // Optional validasi userId (jika admin menginput manual)
  check("userId")
    .optional()
    .isInt().withMessage("User ID harus berupa angka"),

  check("gambarProduk").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Gambar produk tidak boleh kosong");
    }
    return true;
  })
];
//Buat produk 
const createProduk = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(400).json({
        message: error.array()
      });
    }

    const { namaProduk, harga, stok, kategoriId } = req.body;
    const userId = req.user?.idUser || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID tidak ditemukan (token tidak valid atau belum login)" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Gambar produk wajib diupload" });
    }

    const gambarProduk = req.file.filename;

    const produk = await Produk.create({
      namaProduk,
      harga,
      stok,
      gambarProduk,
      kategoriId,
      userId
    });

    res.status(201).json({
      status: 201,
      message: "Produk berhasil dibuat",
      data: produk
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat Produk",
      error: error.message
    });
  }
};


// Mengambil semua produk milik use Login 
const getAllProduk = async (req,res) => {
    try{
        const produk = await Produk.findAll({
            where : {userId : req.user.id}
        });
        res.status(200).json({
            status : 200,
            message : "Produk milik Anda berhasil ditampilkan",
            data : produk
        });
    }catch(error) {
        res.status(500).json({
            message : "Gagal mengambil data",
            error : error.message
        })
    }
};
//Mengambil data produk per id 
const getProdukByid = async(req,res) => {
    try{
        const produk = await Produk.findOne({
            where : {
                id : req.params.id,
                userId : req.user.id
            }
        });
        if(!produk) {
            return res.status(404).json({
                message : "Produk tidak ditemukan"
            });
        }
        res.status(200).json({
            status : 200,
            message : "Produk milik Anda berhasil ditampilkan",
            data : produk
        })
    }catch(error) {
        req.status(500).json({
            message : "Gagal mengambil Produk",
            error : error.message
        })
    }
};
//Update Produk 

const updateProduk = async (req, res) => {
  try {
    const produkId = parseInt(req.params.id);
    const userId = req.user?.idUser; // ✅ GANTI INI

    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const produk = await Produk.findOne({
      where: {
        id: produkId,
        userId: userId
      }
    });

    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan atau bukan milik user ini" });
    }

    const { namaProduk, harga, stok, kategoriId } = req.body;
    const gambar = req.file ? req.file.filename : produk.gambarProduk; // ✅ gunakan `req.file.filename`

    await produk.update({
      namaProduk,
      harga,
      stok,
      kategoriId,
      gambarProduk: gambar // ✅ simpan ke gambarProduk
    });

    res.status(200).json({
      message: "Data produk berhasil diupdate",
      data: produk
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal update produk",
      error: error.message
    });
  }
};


//Menghapus Produk 
const deleteProduk = async (req, res) => {
  try {
    const produk = await Produk.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!produk) {
      return res.status(404).json({
        message: "Produk tidak ditemukan"
      });
    }

    const pathFile = path.resolve("./app/public/uploads/" + produk.gambarProduk);

    // Cek dan hapus file gambar jika ada
    if (produk.gambarProduk) {
      try {
        await fs.access(pathFile); // cek apakah file ada
        await fs.unlink(pathFile); // hapus file
      } catch (err) {
        // File tidak ditemukan, bisa diabaikan
        console.warn("⚠️ Gagal menghapus gambar (mungkin sudah tidak ada):", err.message);
      }
    }

    await produk.destroy();

    res.status(200).json({
      message: "Produk Anda berhasil dihapus"
    });

  } catch (error) {
    res.status(500).json({
      message: "Gagal hapus produk",
      error: error.message
    });
  }
};


module.exports = {
    validasi,
    createProduk,
    getAllProduk,
    getProdukByid,
    updateProduk,
    deleteProduk
}