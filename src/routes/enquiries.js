// /backend/src/routes/enquiries.js
const router = require("express").Router();
const {
  createEnquiry,
  listEnquiries,
} = require("../controllers/enquiryController");
const {
  createEnquiryRules,
  handleValidation,
} = require("../middleware/validation");

router.post("/", createEnquiryRules, handleValidation, createEnquiry);
router.get("/", listEnquiries);

module.exports = router;
