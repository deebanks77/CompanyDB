const express = require("express");
const router = express.Router();

const handleLoginUser = require("../controller/authController");

router.post("/", handleLoginUser);

module.exports = router;
