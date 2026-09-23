import React, { useState, useEffect } from 'react';
import { X, Calendar, Building2, Briefcase, FileText, Bell } from 'lucide-react';
import { STAGES } from '../utils/helpers';

export default function ApplicationModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    applicationDate: new Date().toISOString().split('T')[0],
    stage: 'Applied',
    followUpDate: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        role: initialData.role || '',
        applicationDate: initialData.applicationDate ? initialData.applicationDate.split('T')[0] : '',
        stage: initialData.stage || 'Applied',
        followUpDate: initialData.followUpDate ? initialData.followUpDate.split('T')[0] : '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        companyName: '',
        role: '',
        applicationDate: new Date().toISOString().split('T')[0],
        stage: 'Applied',
        followUpDate: '',
        notes: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.role.trim() || !formData.applicationDate) {
      setError('Company Name, Role, and Application Date are required.');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-gray-700/60 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {initialData ? 'Edit Application' : 'Log New Internship / Job'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Microsoft, Zoho"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Job / Internship Role *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SDE Intern, Frontend Developer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Application Date *
              </label>
              <input
                type="date"
                required
                value={formData.applicationDate}
                onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Current Stage *
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s} className="bg-gray-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              Follow-up Date (Optional Reminder)
            </label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              Notes / Key Details (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Application URL, recruiter contacts, initial thoughts..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
            >
              {initialData ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
