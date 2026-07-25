const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/delivery.controller");

router.get("/", controller.index); // Đường dẫn sẽ là /giao-hang

router.post("/tracking", controller.tracking);

module.exports = router;