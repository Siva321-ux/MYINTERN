import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, ListFilter, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenNewAppModal }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent">
                Smart Tracker
              </span>
              <span className="block text-[10px] text-indigo-400 font-mono uppercase tracking-wider">
                Internships & Jobs
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/applications"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/applications')
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              Applications
            </Link>
          </nav>

          {/* Actions & User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewAppModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Application</span>
            </button>

            {user && (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-800">
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-gray-300">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
