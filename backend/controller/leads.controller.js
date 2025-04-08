const User = require("../models/User");
const Lead = require("../models/Lead");
const { validationResult } = require("express-validator");

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email");
    res.json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address } = req.body;

    const lead = new Lead({
      name,
      email,
      phone,
      address,
      status: "pending",
      assignedTo: req.user.userId, // Assign to current user
    });

    await lead.save();

    // Populate the assignedTo field before sending response
    await lead.populate("assignedTo", "name email");
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    let updateData = {};

    const {
      name,
      email,
      phone,
      address,
      status,
      callResponse,
      callNotes,
      nextCallDate,
    } = req.body;

    if (req.user.role === "telecaller") {
      updateData = {
        name: name || lead.name,
        email: email || lead.email,
        phone: phone || lead.phone,
        address: address || lead.address,
        status: status || lead.status,
        callResponse: callResponse,
        callNotes: callNotes,
        nextCallDate: nextCallDate,
        lastCallDate: new Date(),
      };
    } else {
      updateData = {
        ...req.body,
        lastCallDate: new Date(),
      };
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate("assignedTo", "name email");

    res.json(updatedLead);
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // If user is a telecaller, only allow deleting their own leads
    if (
      req.user.role === "telecaller" &&
      lead.assignedTo.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this lead",
        details: {
          userId: req.user.userId,
          assignedTo: lead.assignedTo,
        },
      });
    }

    await lead.deleteOne();
    res.json({ message: "Lead removed" });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Only assigned telecaller or admin can update status
    if (
      req.user.role !== "admin" &&
      lead.assignedTo.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this lead" });
    }

    lead.status = status;
    lead.lastCallDate = new Date();
    await lead.save();
    await lead.populate("assignedTo", "name email");

    res.json(lead);
  } catch (err) {
    console.error("Error updating lead status:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const getConnectedLeads = async (req, res) => {
  try {
    const connectedLeads = await Lead.find({ status: "contacted" })
      .sort({ lastCallDate: -1 })
      .populate("assignedTo", "name email")
      .limit(10);
    res.json(connectedLeads);
  } catch (err) {
    console.error("Error fetching connected leads:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateCallResponseForLead = async (req, res) => {
  try {
    const { callResponse, callNotes, nextCallDate, isConnected } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Only assigned telecaller or admin can update call response
    if (req.user.role !== "admin" && req.user.role !== "telecaller") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this lead" });
    }

    lead.callResponse = callResponse;
    lead.callNotes = callNotes;
    lead.lastCallDate = new Date();
    lead.nextCallDate = nextCallDate || null;

    // Update status based on connection status and response
    if (isConnected) {
      switch (callResponse) {
        case "discussed":
        case "interested":
          lead.status = "contacted";
          break;
        case "callback":
          lead.status = "callback";
          break;
      }
    } else {
      switch (callResponse) {
        case "busy":
        case "rnr":
        case "switched_off":
          lead.status = "pending";
          break;
      }
    }

    await lead.save();
    await lead.populate("assignedTo", "name email");

    res.json(lead);
  } catch (err) {
    console.error("Error updating call response:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const getLeadStatus = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalTelecallers = await User.countDocuments({ role: "telecaller" });
    const totalCalls = await Lead.countDocuments({
      lastCallDate: { $ne: null },
    });

    // Get total contacted customers (unique leads with status 'contacted' or 'interested')
    const totalContacted = await Lead.countDocuments({
      status: { $in: ["contacted", "interested"] },
    });

    const statusCounts = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const callResponseCounts = await Lead.aggregate([
      {
        $match: {
          callResponse: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$callResponse",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get call trends for the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const callTrends = await Lead.aggregate([
      {
        $match: {
          lastCallDate: { $gte: sevenDaysAgo },
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

    // Get recent activity (last 10 calls)
    const recentActivity = await Lead.find({
      lastCallDate: { $ne: null },
    })
      .sort({ lastCallDate: -1 })
      .limit(10)
      .populate("assignedTo", "name email");

    res.json({
      totalLeads,
      totalTelecallers,
      totalCalls,
      totalContacted,
      statusCounts,
      callResponseCounts,
      callTrends,
      recentActivity,
    });
  } catch (err) {
    console.error("Error fetching lead statistics:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getConnectedLeads,
  updateLeadStatus,
  updateCallResponseForLead,
  getLeadStatus,
};
