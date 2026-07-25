const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);
router.get("/create", controller.create); // Route này fix lỗi Cannot GET
router.post("/create", controller.createPost);

router.get("/edit/:id", controller.edit); // Thêm dòng này để xử lý GET
router.patch("/edit/:id", controller.editPatch); // Thêm dòng này để xử lý lưu dữ liệu

module.exports = router;