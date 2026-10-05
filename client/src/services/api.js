const API_BASE = '/api';

export const api = {
  // Crop Endpoints
  async getCrops(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/crops?${query}`);
    return res.json();
  },

  async getCropById(id) {
    const res = await fetch(`${API_BASE}/crops/${id}`);
    return res.json();
  },

  async recommendSowing(data) {
    const res = await fetch(`${API_BASE}/crops/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Pest & Disease Endpoints
  async getPests(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/pests?${query}`);
    return res.json();
  },

  async getPestById(id) {
    const res = await fetch(`${API_BASE}/pests/${id}`);
    return res.json();
  },

  async diagnoseSymptoms(data) {
    const res = await fetch(`${API_BASE}/pests/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async calculateSprayer(data) {
    const res = await fetch(`${API_BASE}/pests/calculate-sprayer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // AI Advisor Endpoints
  async askAI(data) {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAIHistory() {
    const res = await fetch(`${API_BASE}/ai/history`);
    return res.json();
  },

  // Weather & Seasonal Advisory
  async getWeather() {
    const res = await fetch(`${API_BASE}/weather/advisory`);
    return res.json();
  }
};
