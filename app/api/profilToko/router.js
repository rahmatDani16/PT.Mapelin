const express = require('express');
const router = express.Router();
const {
  validation,
  createProfileToko,
  getProfileToko,
  updateProfileToko,
  deleteProfileToko
} = require('./controller');
const verifyToken = require('../middleware/middleware');

router.post('/profile-toko/create', verifyToken, validation, createProfileToko);
router.get('/profile-toko', verifyToken, getProfileToko);
router.put('/profile-toko/update/:id', verifyToken, validation, updateProfileToko);

router.delete("/profile-toko/delete/:id", verifyToken, deleteProfileToko);
module.exports = router;
