const express = require("express");
const router = express.Router();
const userController = require("../register/controller");
const verifyToken = require("../middleware/middleware")

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/user",verifyToken, userController.getUsers);
router.get("/user/:id",verifyToken, userController.getUserById);
router.put("/user/:id",verifyToken,verifyToken, userController.updateUser);
router.delete("/user/delete/:id",verifyToken, userController.deleteUser);

module.exports = router;
