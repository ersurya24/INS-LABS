const User = require("../models/User");
const Lead = require("../models/Lead");

const getTelecallers = async (req, res) => {
  try {
    const telecallers = await User.find({ role: "telecaller" });
    res.json(telecallers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const leadsAndActivities = async (req, res) => {
  try {
    const telecaller = await User.findById(req.params.id);
    if (!telecaller || telecaller.role !== "telecaller") {
      return res.status(404).json({ message: "Telecaller not found" });
    }

    const leads = await Lead.find({ telecaller: req.params.id }).sort({
      lastCallDate: -1,
    });

    res.json({
      telecaller: {
        id: telecaller._id,
        name: telecaller.name,
        email: telecaller.email,
      },
      leads,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const dashboardStatistics = async (req, res) => {
  try {
    const totalTelecallers = await User.countDocuments({ role: "telecaller" });
    const totalLeads = await Lead.countDocuments();
    const connectedCalls = await Lead.countDocuments({ status: "connected" });

    // Get call trends for the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const callTrends = await Lead.aggregate([
      {
        $match: {
          lastCallDate: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$lastCallDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      totalTelecallers,
      totalLeads,
      connectedCalls,
      callTrends,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTelecallers,
  leadsAndActivities,
  dashboardStatistics,
};
