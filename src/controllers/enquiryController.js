// /src/controllers/enquiryController.js
const Enquiry = require("../models/Enquiry");
const { sendNewEnquiryEmail } = require("../services/mailer");

async function createEnquiry(req, res) {
  try {
    if (process.env.DEBUG_REQ === "1") {
      console.log("[create] Incoming enquiry request");
      console.log("[create] Content-Type:", req.headers["content-type"]);
      console.log("[create] Body keys:", Object.keys(req.body || {}));
      console.log("[create] Body:", req.body);
    }

    const doc = await Enquiry.create(req.body);

    console.log("[create] Saved enquiry _id:", String(doc._id));

    try {
      await sendNewEnquiryEmail(doc);
      console.log("[create] Email notification sent successfully.");
    } catch (mailErr) {
      console.error("[create] Email send failed:", mailErr);
    }

    res.status(201).json(doc);
  } catch (err) {
    console.error("[create] Error creating enquiry:", err);
    res.status(400).json({ error: err.message });
  }
}

async function listEnquiries(_req, res) {
  const items = await Enquiry.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
}

module.exports = { createEnquiry, listEnquiries };
