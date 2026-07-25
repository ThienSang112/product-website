// routes/client/search.route.js
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/search.controller");

router.get("/", controller.index);

router.get("/suggest", controller.suggest);

module.exports = router;