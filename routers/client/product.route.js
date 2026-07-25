const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller")


router.get("/",controller.index  );

// Route xử lý trang chi tiết sản phẩm 
router.get("/detail/:id", controller.detail);

module.exports = router; 