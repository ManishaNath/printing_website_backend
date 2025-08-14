// D:\GITHUB\printing_website_backend\src\middleware\validation.js
const { body, validationResult } = require("express-validator");

const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;

const createEnquiryRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("service").trim().notEmpty().withMessage("Service is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be > 0"),

  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),

  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .matches(PHONE_RE)
    .withMessage("Invalid phone number"),

  body("city")
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 80 })
    .withMessage("City too long"),

  // Require at least one contact channel
  body().custom((val) => {
    if ((!val.email || val.email === "") && (!val.phone || val.phone === "")) {
      throw new Error("Provide email or phone");
    }
    return true;
  }),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arr = errors.array();
    if (process.env.DEBUG_REQ === "1") {
      // richer debug payload in logs and response
      console.log("VALIDATION FAIL:", {
        keys: Object.keys(req.body || {}),
        body: req.body,
        errors: arr,
      });
      return res.status(400).json({ error: arr[0].msg, errors: arr, receivedKeys: Object.keys(req.body || {}) });
    }
    return res.status(400).json({ error: arr[0].msg });
  }
  next();
}

module.exports = { createEnquiryRules, handleValidation };
