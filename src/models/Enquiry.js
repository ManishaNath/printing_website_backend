// D:\GITHUB\printing_website_backend\src\models\Enquiry.js
const { Schema, model } = require("mongoose");

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    city:  { type: String, trim: true }, // NEW
    service: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Enquiry", EnquirySchema);
