import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { applicationService } from '../services/api';
import Timeline from '../components/Timeline';
import StageSelector from '../components/StageSelector';
import { formatDate, formatDateTime, getFollowUpStatus, getStageBadgeClass } from '../utils/helpers';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Calendar,
  Bell,
  Plus,
  Trash2,
  Edit,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';

export default function ApplicationDetails({ onEditApp }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateStage, addNote, deleteApplication } = useApplications();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchDetails = async () => {
    try {
      const data = await applicationService.getById(id);
      setApp(data);
    } catch (err) {
      console.error('Failed to load application details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStageChange = async (newStage) => {
    await updateStage(id, newStage);
    fetchDetails();
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setAddingNote(true);
    try {
      await addNote(id, noteInput.trim());
      setNoteInput('');
      fetchDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete application for ${app.companyName}?`)) {
      await deleteApplication(id);
      navigate('/applications');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">Loading application details...</div>
    );
  }

  if (!app) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center border border-gray-800 max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-white mb-2">Application Not Found</h3>
        <p className="text-xs text-gray-400 mb-4">The application ID does not exist or was deleted.</p>
        <Link
          to="/applications"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </Link>
      </div>
    );
  }

  const followupInfo = getFollowUpStatus(app.followUpDate, app.stage);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" /> Back to Applications List
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-indigo-600/30 shrink-0">
              {app.companyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {app.companyName}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStageBadgeClass(app.stage)}`}>
                  {app.stage}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-300 mt-1">{app.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditApp(app)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-4 h-4 text-amber-400" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-400" /> Delete
            </button>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 rounded-2xl border border-gray-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1">
              <Calendar className="w-4 h-4 text-indigo-400" /> Application Date
            </div>
            <div className="text-sm font-bold text-white">{formatDate(app.applicationDate)}</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-gray-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1">
              <Bell className="w-4 h-4 text-amber-400" /> Follow-up Date
            </div>
            <div className="text-sm font-bold text-white">
              {app.followUpDate && app.stage !== 'Rejected' ? (
                <span className={`px-2 py-0.5 rounded text-xs border ${followupInfo.badgeClass}`}>
                  {followupInfo.text}
                </span>
              ) : (
                <span className="text-gray-500 text-xs">No active follow-up</span>
              )}
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-gray-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1">
              <Clock className="w-4 h-4 text-emerald-400" /> Last Updated
            </div>
            <div className="text-xs font-medium text-gray-300">{formatDateTime(app.updatedAt)}</div>
          </div>
        </div>

        {/* Quick Stage Selector Bar */}
        <div className="glass-card p-4 rounded-2xl border border-gray-800/80">
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Update Current Stage
          </span>
          <StageSelector currentStage={app.stage} onStageChange={handleStageChange} />
        </div>
      </div>

      {/* Two Column Layout: Activity Timeline & Notes Creator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Timeline */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-gray-800">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Application Timeline</h3>
            </div>
            <span className="text-xs text-gray-500 font-mono">Chronological Audit Log</span>
          </div>

          <Timeline activities={app.activities || []} />
        </div>

        {/* Right 1 Col: Note Creator & Application Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Add Note</h3>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows="4"
                placeholder="Log interview feedback, recruiter updates, tech stack details..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={addingNote || !noteInput.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add Note to Timeline
              </button>
            </form>
          </div>

          {app.notes && (
            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Initial / Cumulative Notes
              </h4>
              <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed glass-card p-3 rounded-xl border border-gray-800">
                {app.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
