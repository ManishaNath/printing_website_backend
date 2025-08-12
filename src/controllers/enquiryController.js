// /backend/src/controllers/enquiryController.js
const Enquiry = require("../models/Enquiry");

async function createEnquiry(req, res) {
  try {
    const doc = await Enquiry.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function listEnquiries(_req, res) {
  const items = await Enquiry.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
}

module.exports = { createEnquiry, listEnquiries };
