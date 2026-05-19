const Donation = require("../models/Donation");

async function createDonation(req, res) {
  try {
    const { name, amount, purpose, message, isPublic, paymentId } = req.body;

    const donation = await Donation.create({
      name,
      amount,
      purpose,
      message,
      isPublic,
      paymentId
    });

    res.status(201).json({
      success: true,
      message: "Donation saved successfully",
      donation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to save donation",
      error: error.message
    });
  }
}

async function getRecentDonations(req, res) {
  try {
    const donations = await Donation.find()
      .sort({ date: -1 })
      .limit(10)
      .lean();

    const publicDonations = donations.map((donation) => ({
      ...donation,
      name: donation.isPublic ? donation.name : "Anonymous Donor"
    }));

    res.status(200).json({
      success: true,
      count: publicDonations.length,
      donations: publicDonations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
      error: error.message
    });
  }
}

module.exports = {
  createDonation,
  getRecentDonations
};
