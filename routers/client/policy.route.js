const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/policy.controller");

// Route cho Chính sách bảo hành: /chinh-sach/bao-hanh
router.get("/bao-hanh", controller.index); 

// Route cho Chính sách đổi trả: /chinh-sach/doi-tra
router.get("/doi-tra", controller.returnPolicy);

// Route cho Chính sách đổi trả: /chinh-sach/tra-gop
router.get("/tra-gop", controller.installment);

module.exports = router;