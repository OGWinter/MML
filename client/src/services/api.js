export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

// Helper to attach JWT token
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('radiant_admin_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Public Tracks
  async getTracks(params = {}) {
    const query = new URLSearchParams();
    if (params.genre) query.append('genre', params.genre);
    if (params.vinylSide) query.append('vinylSide', params.vinylSide);
    if (params.search) query.append('search', params.search);
    
    const res = await fetch(`${API_BASE}/tracks?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tracks');
    return res.json();
  },

  async getTrack(id) {
    const res = await fetch(`${API_BASE}/tracks/${id}`);
    if (!res.ok) throw new Error('Track not found');
    return res.json();
  },

  async recordPlay(id) {
    try {
      const res = await fetch(`${API_BASE}/tracks/play/${id}`, { method: 'POST' });
      return res.json();
    } catch (e) {
      return null;
    }
  },

  async toggleLike(id, liked) {
    const res = await fetch(`${API_BASE}/tracks/like/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked })
    });
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/tracks/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // External Music Search (Apple Music & Spotify APIs)
  async searchApple(query, limit = 20) {
    const res = await fetch(`${API_BASE}/external/apple/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error('Apple Music search failed');
    return res.json();
  },

  async searchSpotify(query, limit = 20) {
    const res = await fetch(`${API_BASE}/external/spotify/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error('Spotify search failed');
    return res.json();
  },

  // Admin Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Authentication expired');
    return res.json();
  },

  // Admin Protected Music Management (Multer file upload)
  async uploadTrack(formData) {
    const res = await fetch(`${API_BASE}/tracks`, {
      method: 'POST',
      headers: getHeaders(true), // Let browser set boundary for multipart
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload track');
    return data;
  },

  async importTrack(trackData) {
    const res = await fetch(`${API_BASE}/tracks/import`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(trackData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to import track');
    return data;
  },

  async updateTrack(id, updates) {
    const res = await fetch(`${API_BASE}/tracks/${id}`, {
      method: 'PUT',
      headers: getHeaders(false),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update track');
    return data;
  },

  async deleteTrack(id) {
    const res = await fetch(`${API_BASE}/tracks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete track');
    return data;
  }
};
