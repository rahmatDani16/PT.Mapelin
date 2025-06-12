const express = require("express");
const router = express.Router();
const {validation,createProfileToko ,getAllProfileToko,updateProfileToko, deleteProfileToko} = require("../profilToko/controller");


router.post("/profile/create",createProfileToko);
router.get("/profile",getAllProfileToko);
router.put("/profile/update",validation,updateProfileToko);
router.delete("/profile/delete",deleteProfileToko);

module.exports = router;