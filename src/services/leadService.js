import api from "../api/Api";

export const getAllLeads = async (params = {}) => {
  const response = await api.get("/leads", {
    params,
  });

  return response.data;
};

export const getLeadById = async (id) => {
  const response = await api.get(`/leads/${id}`);

  return response.data;
};

export const createLead = async (leadData) => {
  const response = await api.post("/leads", leadData);

  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await api.put(`/leads/${id}`, leadData);

  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);

  return response.data;
};

export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/leads/status/${id}`, { status });

  return response.data;
};

export const assignLead = async (id, assignedTo) => {
  const response = await api.patch(`/leads/assign/${id}`, { assignedTo });

  return response.data;
};

export const getTeamMembers = async () => {
  const response = await api.get("/users");

  return response.data;
};
