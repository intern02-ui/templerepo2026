const express = require("express");
const {
  generateDonationCertificate
} = require("../controllers/certificateController");

const router = express.Router();

router.post("/certificates/donation", generateDonationCertificate);

module.exports = router;
