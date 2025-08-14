const Enquiry = require("../models/Enquiry");
const { sendNewEnquiryEmail } = require("../services/mailer");

async function createEnquiry(req, res) {
  try {
    if (process.env.DEBUG_REQ === "1") console.log("[create] body keys:", Object.keys(req.body || {}));
    const doc = await Enquiry.create(req.body);
    if (process.env.DEBUG_REQ === "1") console.log("[create] saved _id:", String(doc._id));

    // fire-and-forget; don’t block response
    sendNewEnquiryEmail(doc).catch((e) => console.error("[mailer] error:", e.message));
    res.status(201).json(doc);
  } catch (e) {
    console.error("[create] error:", e.message);
    res.status(400).json({ error: e.message });
  }
}

async function listEnquiries(_req, res) {
  const items = await Enquiry.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
}

module.exports = { createEnquiry, listEnquiries };
