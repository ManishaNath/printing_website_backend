const Enquiry = require("../models/Enquiry");
const { sendNewEnquiryEmail, sendEnquiryNotification } = require("../services/mailer");

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


exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    console.log("[Controller] Enquiry created:", enquiry);

    try {
      await sendEnquiryNotification(enquiry);
    } catch (mailErr) {
      console.error("[Controller] Email send failed:", mailErr.message);
    }

    res.status(201).json(enquiry);
  } catch (err) {
    console.error("[Controller] Failed to create enquiry:", err.message);
    res.status(500).json({ error: err.message });
  }
};
module.exports = { createEnquiry, listEnquiries };

