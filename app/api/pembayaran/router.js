const express = require("express");
const router = express.Router();
const {
  validasiPembayaran,
  createPembayaran,
  getAllPembayaran,
  updatePembayaran,
  deletePembayaran
} = require("./controller");

router.post("/pembayaran/create", validasiPembayaran, createPembayaran);
router.get("/pembayaran", getAllPembayaran);
router.put("/pembayaran/:id", validasiPembayaran, updatePembayaran);
router.delete("/pembayaran/:id", deletePembayaran);

module.exports = router;
