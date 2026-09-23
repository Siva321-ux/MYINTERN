import React, { useState } from 'react';
import { Bell, AlertTriangle, CalendarCheck, Clock, ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

export default function FollowUpBanner({ followups }) {
  const [activeTab, setActiveTab] = useState('all');

  const { overdue = [], today = [], upcoming = [] } = followups || {};
  const totalFollowups = overdue.length + today.length + upcoming.length;

  if (totalFollowups === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center border border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gray-800/80 text-gray-500 flex items-center justify-center mx-auto mb-2">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-gray-300">No Pending Follow-ups</h4>
        <p className="text-xs text-gray-500 mt-1">You are all caught up on follow-up reminders.</p>
      </div>
    );
  }

  const getFilteredList = () => {
    if (activeTab === 'overdue') return overdue;
    if (activeTab === 'today') return today;
    if (activeTab === 'upcoming') return upcoming;
    return [...overdue, ...today, ...upcoming];
  };

  const list = getFilteredList();

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800/80 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Follow-up Reminders
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {totalFollowups} Active
              </span>
            </h3>
            <p className="text-xs text-gray-400">Keep your interview and recruiter follow-ups on schedule</p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-gray-900/80 p-1 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({totalFollowups})
          </button>
          {overdue.length > 0 && (
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'overdue' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              Overdue ({overdue.length})
            </button>
          )}
          {today.length > 0 && (
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'today' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              Today ({today.length})
            </button>
          )}
          {upcoming.length > 0 && (
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'upcoming' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming ({upcoming.length})
            </button>
          )}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {list.map((item) => {
          const todayStr = new Date().toISOString().split('T')[0];
          const dateStr = item.followUpDate ? new Date(item.followUpDate).toISOString().split('T')[0] : '';
          const isOverdue = dateStr < todayStr;
          const isToday = dateStr === todayStr;

          return (
            <div
              key={item._id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isOverdue
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  : isToday
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-gray-900/50 border-gray-800 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {isOverdue ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : isToday ? (
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                ) : (
                  <CalendarCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.companyName}</span>
                    <span className="text-xs text-gray-400">• {item.role}</span>
                  </div>
                  <span className="text-xs font-medium opacity-80">
                    {isOverdue
                      ? `Overdue since ${formatDate(item.followUpDate)}`
                      : isToday
                      ? 'Follow up required today'
                      : `Scheduled: ${formatDate(item.followUpDate)}`}
                  </span>
                </div>
              </div>

              <Link
                to={`/applications/${item._id}`}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title="View details"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
