// D:\GITHUB\printing_website_backend\src\controllers\enquiryController.js
const Enquiry = require("../models/Enquiry");
const { sendNewEnquiryEmail } = require("../services/mailer");

async function createEnquiry(req, res) {
  try {
    if (process.env.DEBUG_REQ === "1") {
      console.log("CREATE ENQUIRY BODY:", req.body);
    }

    const doc = await Enquiry.create(req.body);

    if (process.env.DEBUG_REQ === "1") {
      console.log("ENQUIRY SAVED _id:", String(doc._id));
    }

    // fire-and-forget email
    sendNewEnquiryEmail(doc).catch((e) => console.error("Email error:", e.message));

    res.status(201).json(doc);
  } catch (e) {
    console.error("CREATE ENQUIRY ERROR:", e.message);
    res.status(400).json({ error: e.message });
  }
}

async function listEnquiries(_req, res) {
  const items = await Enquiry.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
}

module.exports = { createEnquiry, listEnquiries };
