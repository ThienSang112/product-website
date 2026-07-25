// routes/client/cart.route.js
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.index);

router.get("/add/:productId", controller.add);

router.get("/delete/:productId", controller.delete);

module.exports = router;