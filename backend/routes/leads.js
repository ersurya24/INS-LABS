const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { auth, checkRole } = require("../middleware/auth");
const { getLeads, getLeadStatus, updateLead, createLead, deleteLead, updateLeadStatus, getConnectedLeads, updateCallResponseForLead } = require("../controller/leads.controller");
 

// @route   GET api/leads // @access  Private (Telecaller & Admin)
router.get("/", auth, checkRole(["admin", "telecaller"]), getLeads);

// @route   POST api/leads // @desc Create a new lead // @access  Private (Telecaller & Admin)
router.post(
  "/",
  [
    auth,
    checkRole(["admin", "telecaller"]),
    // Validation
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  createLead
);

// @route   PATCH api/leads/:id // @desc    Update a lead // @access  Private (Telecaller & Admin)
router.patch("/:id", auth, checkRole(["admin", "telecaller"]), updateLead);

// @route   DELETE api/leads/:id // @desc    Delete a lead // @access  Private (Admin & Telecaller)
router.delete(
  "/:id",
  auth,
  checkRole(["admin", "telecaller"]),
   deleteLead
);

// @route   PATCH api/leads/:id/status // @desc    Update lead status // @access  Private (Telecaller & Admin)
router.patch(
  "/:id/status",
  [
    auth,
    checkRole(["admin", "telecaller"]),
    body("status")
      .isIn([
        "pending",
        "contacted",
        "interested",
        "not-interested",
        "callback",
      ])
      .withMessage("Invalid status value"),
  ],
  updateLeadStatus
);

// @route   GET api/leads/connected // @desc    Get all connected leads // @access  Private (Admin only)
router.get("/connected", auth, checkRole(["admin"]), getConnectedLeads);

// @route   PATCH api/leads/:id/call-response // @desc    Update call response for a lead // @access  Private (Telecaller & Admin)
router.patch(
  "/:id/call-response",
  auth,
  checkRole(["admin", "telecaller"]),
  updateCallResponseForLead
);

// @route   GET api/leads/stats // @desc    Get lead statistics for admin // @access  Private (Admin only)
router.get("/stats", auth, checkRole(["admin"]), getLeadStatus);

module.exports = router;
