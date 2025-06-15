const express = require("express");
const router = express.Router();

const {
  validasi,
  createProduk,
  getAllProduk,
  getProdukByid,
  updateProduk,
  deleteProduk
} = require("../produk/controller");

const verifyToken = require("../middleware/middleware");
const upload = require("../middleware/upload"); 

router.get("/produk", verifyToken, getAllProduk);
router.get("/produk/:id", verifyToken, getProdukByid);
router.post(
  "/produk/create",
  verifyToken,
  upload.single("gambarProduk"),
  validasi,
  createProduk
);
router.put(
  "/produk/update/:id",
  verifyToken,
  upload.single("gambarProduk"),
  validasi,
  updateProduk
);

router.delete("/produk/delete/:id", verifyToken, deleteProduk);

module.exports = router;
