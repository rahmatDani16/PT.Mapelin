const express = require("express");
const router = express.Router();
const {
  validasiTransaksi,
  createTransaksi,
  getAllTransaksi,
  updateTransaksi,
  deleteTransaksi
} = require("./controller");

const verifyToken = require("../middleware/middleware");

router.post("/transaksi/create", verifyToken, validasiTransaksi, createTransaksi);
router.get("/transaksi", verifyToken, getAllTransaksi);
router.put("/transaksi/update/:id", verifyToken, validasiTransaksi, updateTransaksi);
router.delete("/transaksi/delete/:id", verifyToken, deleteTransaksi);

module.exports = router;
