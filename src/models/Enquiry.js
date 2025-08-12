// /backend/src/models/Enquiry.js
const { Schema, model } = require("mongoose");

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    service: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
    paper: { type: String },
    finish: { type: String },
    colors: { type: String },
    deadline: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Enquiry", EnquirySchema);
