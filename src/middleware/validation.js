// /backend/src/middleware/validation.js
const { body, validationResult } = require("express-validator");

const createEnquiryRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("service").trim().notEmpty().withMessage("Service is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be > 0"),
  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  body("phone").optional({ nullable: true, checkFalsy: true }).isString(),
  body().custom((val) => {
    if ((!val.email || val.email === "") && (!val.phone || val.phone === "")) {
      throw new Error("Provide email or phone");
    }
    return true;
  }),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });
  next();
}

module.exports = { createEnquiryRules, handleValidation };
