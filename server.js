const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const verifyToken = require("./app/api/middleware/middleware");
const routerAuth = require("./app/api/register/router");
const routerProduk = require("./app/api/produk/router");
const routerKategori = require("./app/api/kategori/router");
const routerProfileToko = require("./app/api/profilToko/router");
const routerPembayaran = require("./app/api/pembayaran/router");
const routerTransaksi = require("./app/api/transaksi/router");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file upload
app.use("/uploads", express.static(path.join(__dirname, "app/public/uploads")));

// Public routes
app.use("/api/v1", routerAuth);
app.use("/api/v1", routerPembayaran);
app.use("/api/v1", routerProfileToko);
app.use("/api/v1", routerTransaksi);

// Protected routes (wajib token)
app.use("/api/v1", verifyToken, routerProduk);
app.use("/api/v1", verifyToken, routerKategori);

// Jalankan server
app.listen(5008, () => {
  console.log("Server berjalan di http://localhost:5008");
});
