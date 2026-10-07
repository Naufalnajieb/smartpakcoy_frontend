import api from "./api";

const DEVICE_ID = "greenhouse";

export async function getLatestSensor() {
  const response = await api.get(`/sensors/${DEVICE_ID}/latest`);
  return response.data;
}

export async function getSensorHistory(limit = 100) {
  const response = await api.get(`/sensors/${DEVICE_ID}/history`, {
    params: { limit }
  });
  return response.data;
}

export async function getSensorAnalytics(params = {}) {
  const response = await api.get("/sensors/greenhouse/analytics", { params });
  return response.data;
}