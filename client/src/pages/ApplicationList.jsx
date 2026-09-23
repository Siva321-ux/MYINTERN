import React, { useState, useEffect } from 'react';
import { useApplications } from '../context/ApplicationContext';
import { formatDate, getFollowUpStatus, getStageBadgeClass, STAGES } from '../utils/helpers';
import StageSelector from '../components/StageSelector';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutList,
  LayoutGrid,
  Kanban,
  Plus,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Building2,
  Clock,
  History
} from 'lucide-react';

export default function ApplicationList({ onOpenNewAppModal, onEditApp }) {
  const { applications, updateStage, deleteApplication, fetchAllData } = useApplications();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid' | 'kanban'
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  useEffect(() => {
    fetchAllData({
      search: searchQuery,
      stage: stageFilter,
      sort: sortBy
    });
  }, [searchQuery, stageFilter, sortBy]);

  const handleStageSelect = (stage) => {
    setStageFilter(stage);
    if (stage === 'All') searchParams.delete('stage');
    else searchParams.set('stage', stage);
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val) searchParams.delete('q');
    else searchParams.set('q', val);
    setSearchParams(searchParams);
  };

  // Filter for history toggle
  const filteredApps = applications.filter((app) => {
    if (showArchivedOnly) {
      return app.stage === 'Rejected' || app.stage === 'Offer';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Application Management
            {showArchivedOnly && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700 flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> History Archive
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track, filter, update stages, and view chronological history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchivedOnly(!showArchivedOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              showArchivedOnly
                ? 'bg-gray-800 text-white border-indigo-500/50'
                : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            {showArchivedOnly ? 'Show All Applications' : 'History & Archive'}
          </button>
          <button
            onClick={onOpenNewAppModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Application
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sort, View Modes */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
          <button
            onClick={() => handleStageSelect('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              stageFilter === 'All'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-900/60 text-gray-400 border border-gray-800 hover:text-white'
            }`}
          >
            All
          </button>
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => handleStageSelect(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                stageFilter === s
                  ? `${getStageBadgeClass(s)} ring-1 ring-white/20`
                  : 'bg-gray-900/60 text-gray-400 border border-gray-800 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sort & View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest Application</option>
              <option value="oldest">Oldest Application</option>
              <option value="company">Company Name (A-Z)</option>
              <option value="followup">Follow-up Date</option>
            </select>
          </div>

          {/* View Modes */}
          <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid Card View"
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
              className={`p-1.5 rounded ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredApps.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center border border-gray-800 max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Applications Found</h3>
          <p className="text-xs text-gray-400 mb-6">
            {searchQuery || stageFilter !== 'All'
              ? 'No applications match your current search or stage filter.'
              : 'Start logging your job and internship applications!'}
          </p>
          <button
            onClick={onOpenNewAppModal}
            className="px-4 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white text-xs hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First Application
          </button>
        </div>
      )}

      {/* View Mode 1: Table View */}
      {viewMode === 'table' && filteredApps.length > 0 && (
        <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800 bg-gray-900/60">
                <tr>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Follow-up</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredApps.map((app) => {
                  const followupInfo = getFollowUpStatus(app.followUpDate, app.stage);
                  return (
                    <tr key={app._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{app.companyName}</td>
                      <td className="py-3.5 px-4 text-gray-300 font-medium">{app.role}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-xs">{formatDate(app.applicationDate)}</td>
                      <td className="py-3.5 px-4">
                        <StageSelector
                          currentStage={app.stage}
                          onStageChange={(newStage) => updateStage(app._id, newStage)}
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        {app.followUpDate && app.stage !== 'Rejected' ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${followupInfo.badgeClass}`}>
                            {followupInfo.text}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/applications/${app._id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                            title="View timeline & details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => onEditApp(app)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Edit details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteApplication(app._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Grid Card View */}
      {viewMode === 'grid' && filteredApps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            const followupInfo = getFollowUpStatus(app.followUpDate, app.stage);
            return (
              <div
                key={app._id}
                className="glass-card rounded-2xl p-5 border border-gray-800 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {app.companyName}
                      </h3>
                      <p className="text-xs font-semibold text-gray-400">{app.role}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStageBadgeClass(app.stage)}`}>
                      {app.stage}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-400 mt-4 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Applied: {formatDate(app.applicationDate)}</span>
                    </div>

                    {app.followUpDate && app.stage !== 'Rejected' && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${followupInfo.badgeClass}`}>
                          {followupInfo.text}
                        </span>
                      </div>
                    )}

                    {app.notes && (
                      <p className="text-xs text-gray-300 line-clamp-2 mt-2 pt-2 border-t border-gray-800/80 italic">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between">
                  <StageSelector
                    currentStage={app.stage}
                    onStageChange={(newStage) => updateStage(app._id, newStage)}
                  />
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/applications/${app._id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                      title="View timeline"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onEditApp(app)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 3: Kanban Board View */}
      {viewMode === 'kanban' && filteredApps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map((kanbanStage) => {
            const stageApps = filteredApps.filter((a) => a.stage === kanbanStage);
            return (
              <div key={kanbanStage} className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStageBadgeClass(kanbanStage)}`}>
                    {kanbanStage}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-400 bg-gray-900 px-2 py-0.5 rounded">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {stageApps.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 text-xs italic">
                      No applications in {kanbanStage}
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <div key={app._id} className="glass-card p-3.5 rounded-xl border border-gray-800/80 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-white text-sm">{app.companyName}</h4>
                            <p className="text-xs text-gray-400">{app.role}</p>
                          </div>
                          <Link
                            to={`/applications/${app._id}`}
                            className="text-gray-500 hover:text-indigo-400"
                            title="Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        <div className="text-[11px] text-gray-400">Applied: {formatDate(app.applicationDate)}</div>

                        <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between">
                          <span className="text-[10px] text-gray-500">Move to:</span>
                          <div className="flex gap-1">
                            {STAGES.filter((s) => s !== kanbanStage).map((targetStage) => (
                              <button
                                key={targetStage}
                                onClick={() => updateStage(app._id, targetStage)}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-gray-900 text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                              >
                                {targetStage.charAt(0)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
