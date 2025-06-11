const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const authMiddleware = require("./app/api/middleware/middleware");
const routerAuth = require("./app/api/register/router");
const routerProduk = require("./app/api/produk/router");
const Kategori = require("./app/api/kategori/router")
const ProfileToko = require("./app/api/profilToko/router")

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file (untuk akses gambar yang di-upload)
app.use("/uploads", express.static(path.join(__dirname, "app/public/uploads")));

app.use("/api/v1", routerAuth);
app.use("/api/v1", authMiddleware, routerProduk);
app.use("/api/v1", authMiddleware,Kategori);
app.use("/api/vi",ProfileToko)

app.listen(5008, () => {
  console.log("Server berjalan dengan baik");
});
