import React from 'react';
import { formatDateTime, getStageBadgeClass } from '../utils/helpers';
import { Calendar, FileText, ArrowRight, Bell, Sparkles } from 'lucide-react';

export default function Timeline({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm italic">
        No activity logged yet.
      </div>
    );
  }

  // Sort activities newest first or oldest first (chronological order)
  const sorted = [...activities].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const getActivityIcon = (type) => {
    switch (type) {
      case 'CREATED':
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'STAGE_CHANGED':
        return <ArrowRight className="w-4 h-4 text-amber-400" />;
      case 'NOTE_ADDED':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'FOLLOW_UP_UPDATED':
        return <Bell className="w-4 h-4 text-blue-400" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-800">
      {sorted.map((item, index) => (
        <div key={item._id || index} className="relative group">
          {/* Timeline Dot */}
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-gray-900 border-2 border-indigo-500/40 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>

          <div className="glass-card rounded-xl p-3.5 border border-gray-800/80">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <div className="flex items-center gap-1.5 font-medium text-gray-300">
                {getActivityIcon(item.type)}
                <span>
                  {item.type === 'CREATED' && 'Application Created'}
                  {item.type === 'STAGE_CHANGED' && 'Stage Transition'}
                  {item.type === 'NOTE_ADDED' && 'Note Appended'}
                  {item.type === 'FOLLOW_UP_UPDATED' && 'Follow-up Set'}
                </span>
              </div>
              <time className="text-[11px] text-gray-500">{formatDateTime(item.createdAt)}</time>
            </div>

            <div className="text-sm text-gray-200">
              {item.type === 'STAGE_CHANGED' ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStageBadgeClass(item.previousStage)}`}>
                    {item.previousStage}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStageBadgeClass(item.newStage)}`}>
                    {item.newStage}
                  </span>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{item.content}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
