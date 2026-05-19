const express = require("express");
const { getHome } = require("../controllers/indexController");

const router = express.Router();

router.get("/", getHome);

module.exports = router;
