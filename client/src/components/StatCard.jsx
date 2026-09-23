import React from 'react';
import { Briefcase, Send, MessageSquareText, Award, XCircle } from 'lucide-react';

export default function StatCard({ label, count, type, onClick, active }) {
  const getConfig = () => {
    switch (type) {
      case 'total':
        return {
          icon: Briefcase,
          color: 'from-indigo-500 to-blue-600',
          textColor: 'text-indigo-400',
          borderColor: 'border-indigo-500/30',
          glow: 'group-hover:shadow-indigo-500/20'
        };
      case 'applied':
        return {
          icon: Send,
          color: 'from-blue-500 to-indigo-500',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30',
          glow: 'group-hover:shadow-blue-500/20'
        };
      case 'interview':
        return {
          icon: MessageSquareText,
          color: 'from-amber-500 to-yellow-500',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          glow: 'group-hover:shadow-amber-500/20'
        };
      case 'offer':
        return {
          icon: Award,
          color: 'from-emerald-500 to-teal-500',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          glow: 'group-hover:shadow-emerald-500/20'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'from-rose-500 to-red-600',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/30',
          glow: 'group-hover:shadow-rose-500/20'
        };
      default:
        return {
          icon: Briefcase,
          color: 'from-gray-600 to-gray-700',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-700',
          glow: ''
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-5 glass-card relative overflow-hidden transition-all duration-300 ${
        config.borderColor
      } ${active ? 'ring-2 ring-indigo-500 bg-gray-800/80 shadow-lg' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{count}</h3>
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} p-3 text-white shadow-md flex items-center justify-center transition-transform group-hover:scale-110`}
        >
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
      {/* Bottom accent glow */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.color} opacity-40 group-hover:opacity-100 transition-opacity`}
      />
    </div>
  );
}
