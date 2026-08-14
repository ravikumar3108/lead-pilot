import api from "../api/Api";

export const createFollowUp = async (followUpData) => {
  const response = await api.post("/followups", followUpData);

  return response.data;
};

export const getAllFollowUps = async (params = {}) => {
  const response = await api.get("/followups", {
    params,
  });

  return response.data;
};

export const getFollowUpById = async (id) => {
  const response = await api.get(`/followups/${id}`);

  return response.data;
};

export const updateFollowUp = async (id, followUpData) => {
  const response = await api.put(`/followups/${id}`, followUpData);

  return response.data;
};

export const deleteFollowUp = async (id) => {
  const response = await api.delete(`/followups/${id}`);

  return response.data;
};

export const updateFollowUpStatus = async (id, status) => {
  const response = await api.put(`/followups/${id}`, {
    status,
  });

  return response.data;
};
