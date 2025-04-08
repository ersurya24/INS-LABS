const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  registerController,
  loginController,
} = require("../controller/auth.controller");

// Register new user
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
    check("role", "Invalid role").isIn(["admin", "telecaller"]),
  ],
  registerController
);

// Login user
router.post(
  "/login",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginController
);

module.exports = router;
