import React, { createContext, useContext, useState, useEffect } from 'react';
import { applicationService } from '../services/api';
import { useAuth } from './AuthContext';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 });
  const [followups, setFollowups] = useState({ upcoming: [], today: [], overdue: [] });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllData = async (filterParams = {}) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [appsData, statsData, followupsData] = await Promise.all([
        applicationService.getAll(filterParams),
        applicationService.getStats(),
        applicationService.getFollowups()
      ]);
      setApplications(appsData);
      setStats(statsData);
      setFollowups(followupsData);
    } catch (err) {
      console.error('Error fetching application data:', err);
      showToast('Failed to load application data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      setApplications([]);
      setStats({ total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 });
      setFollowups({ upcoming: [], today: [], overdue: [] });
    }
  }, [isAuthenticated]);

  const createApplication = async (data) => {
    const newApp = await applicationService.create(data);
    showToast(`Application for ${newApp.companyName} created!`);
    await fetchAllData();
    return newApp;
  };

  const updateApplication = async (id, data) => {
    const updated = await applicationService.update(id, data);
    showToast(`Application updated successfully.`);
    await fetchAllData();
    return updated;
  };

  const updateStage = async (id, newStage) => {
    const updated = await applicationService.updateStage(id, newStage);
    showToast(`Stage updated to ${newStage}!`);
    await fetchAllData();
    return updated;
  };

  const addNote = async (id, noteText) => {
    const updated = await applicationService.addNote(id, noteText);
    showToast('Note added to timeline.');
    await fetchAllData();
    return updated;
  };

  const deleteApplication = async (id) => {
    await applicationService.delete(id);
    showToast('Application deleted.');
    await fetchAllData();
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        stats,
        followups,
        loading,
        toast,
        showToast,
        fetchAllData,
        createApplication,
        updateApplication,
        updateStage,
        addNote,
        deleteApplication
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationContext);
