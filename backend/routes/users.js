const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../middleware/auth");
const {
  getTelecallers,
  leadsAndActivities,
  dashboardStatistics,
} = require("../controller/user.controller");

// Get all telecallers (admin only)
router.get("/telecallers", auth, checkRole(["admin"]), getTelecallers);

// Get telecaller's leads and activities (admin only)
router.get(
  "/telecallers/:id/activities",
  auth,
  checkRole(["admin"]),
  leadsAndActivities
);

// Get dashboard statistics (admin only)
router.get("/dashboard/stats", auth, checkRole(["admin"]), dashboardStatistics);

module.exports = router;
