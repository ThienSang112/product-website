const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/user.controller");

router.get("/", controller.index);

router.delete("/delete/:id", controller.deleteItem); 

router.get("/edit/:id", controller.edit);

router.post("/edit/:id", controller.editPost);

module.exports = router;