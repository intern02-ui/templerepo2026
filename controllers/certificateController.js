const PDFDocument = require("pdfkit");

function normalizeText(value, fallback = "") {
  const text = String(value ?? fallback).trim();
  return text || fallback;
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatAmount(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return `INR ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function makeFilename(name) {
  const safeName = normalizeText(name, "donor")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return `donation-certificate-${safeName || "donor"}.pdf`;
}

function drawCertificate(doc, certificate) {
  const { donorName, amount, purpose, date, templeName } = certificate;

  doc.rect(24, 24, 744, 564).lineWidth(3).stroke("#8b5e34");
  doc.rect(38, 38, 716, 536).lineWidth(1).stroke("#d6b26b");

  doc
    .fillColor("#6f3f18")
    .font("Times-Bold")
    .fontSize(28)
    .text(templeName, 60, 72, { align: "center", width: 672 });

  doc
    .moveTo(170, 118)
    .lineTo(622, 118)
    .lineWidth(1)
    .stroke("#d6b26b");

  doc
    .fillColor("#1f2933")
    .font("Times-Bold")
    .fontSize(36)
    .text("Donation Certificate", 60, 148, { align: "center", width: 672 });

  doc
    .font("Times-Roman")
    .fontSize(17)
    .fillColor("#444444")
    .text("This certificate is gratefully presented to", 60, 220, {
      align: "center",
      width: 672
    });

  doc
    .font("Times-Bold")
    .fontSize(32)
    .fillColor("#111827")
    .text(donorName, 90, 258, { align: "center", width: 612 });

  doc
    .font("Times-Roman")
    .fontSize(17)
    .fillColor("#444444")
    .text("for the generous donation of", 60, 316, {
      align: "center",
      width: 672
    });

  doc
    .font("Times-Bold")
    .fontSize(28)
    .fillColor("#6f3f18")
    .text(amount, 60, 350, { align: "center", width: 672 });

  doc
    .font("Times-Roman")
    .fontSize(16)
    .fillColor("#444444")
    .text(`Purpose: ${purpose}`, 110, 414, { align: "center", width: 572 })
    .text(`Date: ${date}`, 110, 446, { align: "center", width: 572 });

  doc
    .moveTo(480, 515)
    .lineTo(680, 515)
    .lineWidth(1)
    .stroke("#8b5e34");

  doc
    .font("Times-Roman")
    .fontSize(12)
    .fillColor("#444444")
    .text("Authorized Signatory", 480, 524, { align: "center", width: 200 });
}

function generateDonationCertificate(req, res) {
  const donorName = normalizeText(req.body.donorName ?? req.body.name);
  const purpose = normalizeText(req.body.purpose);
  const templeName = normalizeText(req.body.templeName, "Temple Trust");
  const date = formatDate(req.body.date);
  const amount = formatAmount(req.body.amount);

  if (!donorName || !purpose || !date || !amount) {
    return res.status(400).json({
      success: false,
      message:
        "donorName, amount, purpose, and a valid date are required to generate a certificate"
    });
  }

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 0,
    info: {
      Title: "Donation Certificate",
      Author: templeName
    }
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${makeFilename(donorName)}"`
  );

  doc.on("error", () => {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate donation certificate"
      });
    }
  });

  doc.pipe(res);
  drawCertificate(doc, {
    donorName,
    amount,
    purpose,
    date,
    templeName
  });
  doc.end();
}

module.exports = {
  generateDonationCertificate
};
