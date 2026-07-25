const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const orderController = require("../../controllers/client/order.controller"); // Trỏ đúng đến controller xử lý đơn hàng

router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);


router.get("/orders", orderController.orders);


// Route đăng ký 
router.get("/register", controller.register);
router.post("/register", controller.registerPost);

module.exports = router;