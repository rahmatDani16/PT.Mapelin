const express = require("express");
const router = express.Router();
const {
  validasiPembayaran,
  createPembayaran,
  getAllPembayaran,
  updatePembayaran,
  deletePembayaran
} = require("./controller");
const verifyToken = require("../middleware/middleware")

router.post("/pembayaran/create",verifyToken, validasiPembayaran, createPembayaran);
router.get("/pembayaran",verifyToken, getAllPembayaran);
router.put("/pembayaran/update/:id",verifyToken, validasiPembayaran, updatePembayaran);
router.delete("/pembayaran/delete/:id",verifyToken, deletePembayaran);

module.exports = router;
