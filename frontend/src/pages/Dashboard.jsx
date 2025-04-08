import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import * as leadService from "../services/leadService";
import { format, parseISO } from "date-fns";
import { PhoneCall, Users, UserCheck, PhoneForwarded } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CALL_RESPONSES = {
  discussed: "DISCUSSED",
  callback: "CALL BACK",
  interested: "INTERESTED",
  busy: "BUSY",
  rnr: "RINGING NO RESPONSE",
  switched_off: "SWITCHED OFF",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalTelecallers: 0,
    totalCalls: 0,
    totalContacted: 0,
    statusCounts: [],
    callResponseCounts: [],
    callTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialog, setDialog] = useState({ type: null, open: false });
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "pending",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await leadService.getLeadStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      interested: "bg-green-100 text-green-800",
      "not-interested": "bg-red-100 text-red-800",
      callback: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getCallResponseColor = (response) => {
    const colors = {
      discussed: "bg-blue-100 text-blue-800",
      callback: "bg-purple-100 text-purple-800",
      interested: "bg-green-100 text-green-800",
      busy: "bg-yellow-100 text-yellow-800",
      rnr: "bg-orange-100 text-orange-800",
      switched_off: "bg-red-100 text-red-800",
    };
    return colors[response] || "bg-gray-100 text-gray-800";
  };

  const chartData = {
    labels:
      stats.callTrends?.map((trend) => format(parseISO(trend._id), "MMM dd")) ||
      [],
    datasets: [
      {
        label: "CALLS PER DAY (LAST 7 DAYS)",
        data: stats.callTrends?.map((trend) => trend.count) || [],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Call Trends (Last 7 Days)",
        font: {
          size: 16,
          family: "Outfit",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const openDialog = (type, lead = null) => {
    setSelectedLead(lead);
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        status: lead.status,
      });
    } else {
      clearFormData();
    }
    setDialog({ type, open: true });
  };

  const closeDialog = () => {
    setDialog({ type: null, open: false });
    clearFormData();
  };

  const clearFormData = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "pending",
    });
    setSelectedLead(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (dialog.type === "edit" && selectedLead) {
        await leadService.updateLead(selectedLead._id, formData);
        toast.success("Lead updated successfully");
        fetchDashboardData();
      }
      closeDialog();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update lead"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">DASHBOARD</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">TOTAL TELECALLER</p>
              <h3 className="text-2xl font-bold">{stats.totalTelecallers}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100">
              <PhoneCall className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">TOTAL CALLS</p>
              <h3 className="text-2xl font-bold">{stats.totalCalls}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-100">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">CONTACTED CUSTOMERS</p>
              <h3 className="text-2xl font-bold">{stats.totalContacted}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-yellow-100">
              <PhoneForwarded className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">TOTAL LEADS</p>
              <h3 className="text-2xl font-bold">{stats.totalLeads}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 flex justify-center items-center">
        <div className="h-[400px] w-[600px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-center">
          RECENT ACTIVITIES
        </h2>
        <Card className={"p-4"}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>LEAD NAME</TableHead>
                <TableHead>RESPONSE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>LAST CALL</TableHead>
                <TableHead>NEXT CALL</TableHead>
                <TableHead>ASSIGNED TO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentActivity?.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>
                    {lead.callResponse && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCallResponseColor(
                          lead.callResponse
                        )}`}
                      >
                        {CALL_RESPONSES[lead.callResponse]}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status.charAt(0).toUpperCase() +
                        lead.status.slice(1).toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {lead.lastCallDate
                      ? format(new Date(lead.lastCallDate), "PPp")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {lead.nextCallDate
                      ? format(new Date(lead.nextCallDate), "PPp")
                      : "-"}
                  </TableCell>
                  <TableCell>{lead.assignedTo?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={dialog.open} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="p-3 text-center">
              {dialog.type === "edit" ? "EDIT LEAD" : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="pending">PENDING</option>
                <option value="contacted">CONTACTED</option>
                <option value="interested">INTERESTED</option>
                <option value="not-interested">NOT INTERESTED</option>
                <option value="callback">CALL BACK</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
