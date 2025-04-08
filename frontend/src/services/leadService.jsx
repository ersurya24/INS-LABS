import axios from "../utils/axios";

export const getLeads = async () => {
  const response = await axios.get("/leads");
  return response.data;
};

export const addLead = async (leadData) => {
  const response = await axios.post("/leads", leadData);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  try {
    console.log("Updating lead with data:", leadData);
    const response = await axios.patch(`/leads/${id}`, leadData);
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const deleteLead = async (leadId) => {
  const response = await axios.delete(`/leads/${leadId}`);
  return response.data;
};

export const updateCallResponse = async (leadId, callData) => {
  const response = await axios.patch(
    `/leads/${leadId}/call-response`,
    callData
  );
  return response.data;
};

export const getLeadStats = async () => {
  const response = await axios.get("/leads/stats");
  return response.data;
};
