const express = require("express");
const {
  createDonation,
  getRecentDonations
} = require("../controllers/donationController");

const router = express.Router();

router.post("/donate", createDonation);
router.get("/donations", getRecentDonations);

module.exports = router;
