import axios from 'axios';
import { INITIAL_APPLICATIONS } from './mockData';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper for local mock storage initialization
const getLocalApps = () => {
  const stored = localStorage.getItem('mock_applications');
  if (!stored) {
    localStorage.setItem('mock_applications', JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_APPLICATIONS;
  }
};

const saveLocalApps = (apps) => {
  localStorage.setItem('mock_applications', JSON.stringify(apps));
};

export const authService = {
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      // Fallback for client-side demo before backend runs
      if (!err.response || err.code === 'ERR_NETWORK') {
        const dummyUser = { id: 'u1', name: email.split('@')[0] || 'Demo Student', email };
        const dummyToken = 'mock-jwt-token-demo';
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        return { user: dummyUser, token: dummyToken };
      }
      throw err.response?.data?.message || 'Login failed';
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK') {
        const dummyUser = { id: 'u-' + Date.now(), name, email };
        const dummyToken = 'mock-jwt-token-demo';
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        return { user: dummyUser, token: dummyToken };
      }
      throw err.response?.data?.message || 'Registration failed';
    }
  },

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      const user = localStorage.getItem('user');
      if (user) return JSON.parse(user);
      throw 'Not authenticated';
    }
  }
};

export const applicationService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/applications', { params });
      return res.data;
    } catch (err) {
      // Client offline fallback
      let apps = getLocalApps();
      const { search, stage, sort } = params;

      if (search) {
        const q = search.toLowerCase();
        apps = apps.filter(
          (a) => a.companyName.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
        );
      }

      if (stage && stage !== 'All') {
        apps = apps.filter((a) => a.stage === stage);
      }

      if (sort === 'oldest') {
        apps.sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate));
      } else if (sort === 'company') {
        apps.sort((a, b) => a.companyName.localeCompare(b.companyName));
      } else if (sort === 'followup') {
        apps.sort((a, b) => {
          if (!a.followUpDate) return 1;
          if (!b.followUpDate) return -1;
          return new Date(a.followUpDate) - new Date(b.followUpDate);
        });
      } else {
        // default newest
        apps.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
      }

      return apps;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/applications/${id}`);
      return res.data;
    } catch (err) {
      const apps = getLocalApps();
      const app = apps.find((a) => a._id === id);
      if (!app) throw new Error('Application not found');
      return app;
    }
  },

  create: async (data) => {
    try {
      const res = await api.post('/applications', data);
      return res.data;
    } catch (err) {
      const apps = getLocalApps();
      const newApp = {
        _id: 'app-' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        activities: [
          {
            _id: 'act-' + Date.now(),
            type: 'CREATED',
            content: 'Application created',
            createdAt: new Date().toISOString()
          }
        ]
      };
      if (data.notes) {
        newApp.activities.push({
          _id: 'act-note-' + Date.now(),
          type: 'NOTE_ADDED',
          content: data.notes,
          createdAt: new Date().toISOString()
        });
      }
      apps.unshift(newApp);
      saveLocalApps(apps);
      return newApp;
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/applications/${id}`, data);
      return res.data;
    } catch (err) {
      const apps = getLocalApps();
      const index = apps.findIndex((a) => a._id === id);
      if (index === -1) throw new Error('Application not found');

      const oldApp = apps[index];
      const updatedApp = {
        ...oldApp,
        ...data,
        updatedAt: new Date().toISOString()
      };

      apps[index] = updatedApp;
      saveLocalApps(apps);
      return updatedApp;
    }
  },

  updateStage: async (id, newStage) => {
    try {
      const res = await api.patch(`/applications/${id}/stage`, { stage: newStage });
      return res.data;
    } catch (err) {
      const apps = getLocalApps();
      const index = apps.findIndex((a) => a._id === id);
      if (index === -1) throw new Error('Application not found');

      const oldApp = apps[index];
      const previousStage = oldApp.stage;
      oldApp.stage = newStage;
      oldApp.updatedAt = new Date().toISOString();

      if (!oldApp.activities) oldApp.activities = [];
      oldApp.activities.push({
        _id: 'act-' + Date.now(),
        type: 'STAGE_CHANGED',
        content: `Stage changed from ${previousStage} to ${newStage}`,
        previousStage,
        newStage,
        createdAt: new Date().toISOString()
      });

      apps[index] = oldApp;
      saveLocalApps(apps);
      return oldApp;
    }
  },

  addNote: async (id, noteText) => {
    try {
      const res = await api.post(`/applications/${id}/notes`, { note: noteText });
      return res.data;
    } catch (err) {
      const apps = getLocalApps();
      const index = apps.findIndex((a) => a._id === id);
      if (index === -1) throw new Error('Application not found');

      const app = apps[index];
      if (!app.notes) app.notes = noteText;
      else app.notes += `\n${noteText}`;

      if (!app.activities) app.activities = [];
      app.activities.push({
        _id: 'act-' + Date.now(),
        type: 'NOTE_ADDED',
        content: noteText,
        createdAt: new Date().toISOString()
      });

      app.updatedAt = new Date().toISOString();
      apps[index] = app;
      saveLocalApps(apps);
      return app;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      return true;
    } catch (err) {
      let apps = getLocalApps();
      apps = apps.filter((a) => a._id !== id);
      saveLocalApps(apps);
      return true;
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/dashboard/stats');
      return res.data;
    } catch (err) {
      const apps = getLocalApps();
      const stats = {
        total: apps.length,
        applied: apps.filter((a) => a.stage === 'Applied').length,
        interview: apps.filter((a) => a.stage === 'Interview').length,
        offer: apps.filter((a) => a.stage === 'Offer').length,
        rejected: apps.filter((a) => a.stage === 'Rejected').length
      };
      return stats;
    }
  },

  getFollowups: async () => {
    try {
      const res = await api.get('/applications/followups');
      return res.data;
    } catch (err) {
      const apps = getLocalApps();
      const todayStr = new Date().toISOString().split('T')[0];

      const activeApps = apps.filter((a) => a.stage !== 'Rejected' && a.followUpDate);

      const upcoming = activeApps.filter((a) => a.followUpDate > todayStr);
      const today = activeApps.filter((a) => a.followUpDate === todayStr);
      const overdue = activeApps.filter((a) => a.followUpDate < todayStr);

      return { upcoming, today, overdue };
    }
  }
};
