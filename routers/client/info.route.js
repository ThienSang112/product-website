// routes/client/info.route.js
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/info.controller");
const Contact = require("../../models/contact.model"); // Điều chỉnh đường dẫn tới file model của bạn

router.get("/gioi-thieu", controller.about);
router.get("/tuyen-dung", controller.recruitment);
router.get("/tin-tuc", controller.news);
router.get("/lien-he", controller.contact);
router.post("/lien-he", controller.contactPost);

module.exports = router;