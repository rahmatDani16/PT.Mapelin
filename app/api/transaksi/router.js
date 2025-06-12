const express = require("express");
const router = express.Router();
const {
  validasiTransaksi,
  createTransaksi,
  getAllTransaksi,
  updateTransaksi,
  deleteTransaksi
} = require("../transaksi/controller");

// Rute untuk transaksi
router.post("/transaksi/create", validasiTransaksi, createTransaksi);
router.get("/transaksi", getAllTransaksi);
router.put("/transaksi/:id", validasiTransaksi, updateTransaksi);
router.delete("/transaksi/:id", deleteTransaksi);

module.exports = router;
