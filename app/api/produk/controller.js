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
const createProduk = async(req,res) => {
    try{
       const error = validationResult(req);
        if(!error.isEmpty()){
            if(req.file){
                await fs.unlink(req.file.path);
            }
            return res.status(400).json({
                message : error.array()
            });
        }
        const {namaProduk,harga,stok,kategoriId} = req.body;
        const userId = req.user?.id || req.body.userId;
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
            status : 201,
            message : "Produk berhasil dibuat",
            data : produk
        })
    }catch(error){
        res.status(500).json({
            message : "Gagal membuat Produk",
            error : error.message
        })
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
            message : "Data Produk",
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
            message : "Detail Produk",
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
const updateProduk = async(req,res) => {
    try{
        const error = validasiResult(req);
        if(!error.isEmpty()){
            if(req.file) {
                await fs.unlink(req.file.path);
            }
            return res.status(400).json({
                message : error.array()
            })
        }
        const produk = await Produk.findOne({
            where : {
                id : req.params.id,
                userId : req.user.id
            }
        });
        if(!produk){
            return res.status(404).json({
                message : " Produk tidak ditemukan "
            })
        }
        let {namaProduk,harga,stok,kategoriId} = req.body;
        await produk.update({
            namaProduk,
            harga,
            stok,
            kategoriId,
            gambarProduk : gambar
        });
        res.status(200).json({
            message : "Produk berhasil diperbarui"
        })
    }catch(error) {
        res.status(500).json({
            message : "Gagal update Produk",
            Error : error.message
        })
    }
};
//Menghapus Produk 
const deleteProduk = async(req,res) => {
    try{
        const produk = await Produk.findOne({
            where : {
                id : req.params.id,
                userId : req.user.id
            }
        });
        if(!produk){
            return res.status(404).json({
                message : "Produk tidak ditemukan"
            })
        }
        const pathFile = path.resolve("./app/public/uploads/" + produk.gambarProduk);
        if(produk.gambarProduk){
            await fs.unlink(pathFile)
        }
        await produk.destroy();
        res.status(200).json({
            message : "Produk berhasil di hapus"
        })
    }catch(error) {
        res.status(500).json({
            message : "Gagal hapus produk",
            error : error.message
        })
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