const express = require("express");
const router = express.Router();
const kategoriController = require("./controller");
const verifyToken = require("../middleware/middleware")

// Ambil validasi dari controller
const { validasi } = kategoriController;


router.get("/kategori", kategoriController.getAllKategori);
router.get("/kategori/:id", kategoriController.getKategoriById);
router.post("/kategori/create", verifyToken, validasi, kategoriController.createKategori);
router.put("/kategori/update/:id", validasi, kategoriController.updateKategori);
router.delete("/kategori/delete/:id", kategoriController.deleteKategori);

module.exports = router;
