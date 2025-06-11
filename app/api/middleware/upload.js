const multer = require("multer");
const path = require("path");

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Simpan di folder: app/public/uploads/
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const namaFile = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, namaFile);
  },
});

// Filter file yang boleh diupload (hanya gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (jpeg, jpg, png, gif) yang diperbolehkan"));
  }
};

// Limit ukuran file (misalnya max 2MB)
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

module.exports = upload;
