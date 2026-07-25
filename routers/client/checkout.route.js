const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");

router.get("/", controller.index);
router.post("/order", controller.order);
router.get("/success/:id", controller.success); // Trang thông báo thành công

router.get("/buy-now/:id", controller.buyNow);

module.exports = router;