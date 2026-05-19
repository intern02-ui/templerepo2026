const crypto = require("crypto");

const createRazorpayInstance = require("../config/razorpay");
const Donation = require("../models/Donation");

async function createOrder(req, res) {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount"
      });
    }

    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message
    });
  }
}

function isValidSignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error("Razorpay secret is missing in environment variables");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const received = Buffer.from(String(signature), "hex");
  const expected = Buffer.from(generatedSignature, "hex");

  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

async function verifyPayment(req, res) {
  try {
    const {
      order_id,
      payment_id,
      signature,
      name,
      amount,
      purpose,
      message,
      isPublic
    } = req.body;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required"
      });
    }

    if (!name || !amount || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Donation details are required"
      });
    }

    const donationAmount = Number(amount);
    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid donation amount"
      });
    }

    if (!isValidSignature(order_id, payment_id, signature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    const donation = await Donation.create({
      name,
      amount: donationAmount,
      purpose,
      message,
      isPublic: Boolean(isPublic),
      paymentId: payment_id
    });

    res.status(201).json({
      success: true,
      message: "Payment verified and donation saved successfully",
      donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
}

module.exports = {
  createOrder,
  verifyPayment
};
