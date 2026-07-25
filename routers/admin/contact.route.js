const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/contact.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail); // Route xem chi tiết
router.delete("/delete/:id", controller.delete); // Route xóa

module.exports = router;