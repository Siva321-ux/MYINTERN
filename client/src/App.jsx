import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ApplicationProvider, useApplications } from './context/ApplicationContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ApplicationModal from './components/ApplicationModal';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplicationList from './pages/ApplicationList';
import ApplicationDetails from './pages/ApplicationDetails';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-gray-400 text-sm">Loading application...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function MainLayout() {
  const { createApplication, updateApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const handleOpenNewModal = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    if (editingApp) {
      await updateApplication(editingApp._id, formData);
    } else {
      await createApplication(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar onOpenNewAppModal={handleOpenNewModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard onOpenNewAppModal={handleOpenNewModal} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationList
                  onOpenNewAppModal={handleOpenNewModal}
                  onEditApp={handleOpenEditModal}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetails onEditApp={handleOpenEditModal} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-gray-800/60 py-6 text-center text-xs text-gray-500">
        PS65 Internship Application Tracker &bull; Designed & Built with Modern MERN Architecture
      </footer>

      <Toast />

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingApp}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ApplicationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </ApplicationProvider>
      </AuthProvider>
    </Router>
  );
}
