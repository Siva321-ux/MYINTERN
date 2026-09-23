import React from 'react';
import { useApplications } from '../context/ApplicationContext';
import StatCard from '../components/StatCard';
import FollowUpBanner from '../components/FollowUpBanner';
import { formatDate, getStageBadgeClass } from '../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, ExternalLink, TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function Dashboard({ onOpenNewAppModal }) {
  const { stats, applications, followups, updateStage } = useApplications();
  const navigate = useNavigate();

  // Recharts Chart Data
  const pieData = [
    { name: 'Applied', value: stats.applied || 0, color: '#6366f1' },
    { name: 'Interview', value: stats.interview || 0, color: '#f59e0b' },
    { name: 'Offer', value: stats.offer || 0, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected || 0, color: '#f43f5e' }
  ];

  const barData = [
    { name: 'Applied', count: stats.applied || 0 },
    { name: 'Interview', count: stats.interview || 0 },
    { name: 'Offer', count: stats.offer || 0 },
    { name: 'Rejected', count: stats.rejected || 0 }
  ];

  const recentApps = [...applications].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Dashboard Overview
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time pipeline analytics, dynamic stats, and upcoming follow-ups
          </p>
        </div>
        <button
          onClick={onOpenNewAppModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Log New Application
        </button>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Applications"
          count={stats.total}
          type="total"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          label="Applied"
          count={stats.applied}
          type="applied"
          onClick={() => navigate('/applications?stage=Applied')}
        />
        <StatCard
          label="Interview"
          count={stats.interview}
          type="interview"
          onClick={() => navigate('/applications?stage=Interview')}
        />
        <StatCard
          label="Offer"
          count={stats.offer}
          type="offer"
          onClick={() => navigate('/applications?stage=Offer')}
        />
        <StatCard
          label="Rejected"
          count={stats.rejected}
          type="rejected"
          onClick={() => navigate('/applications?stage=Rejected')}
        />
      </div>

      {/* Follow-up Reminders Alert Banner */}
      <FollowUpBanner followups={followups} />

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Stage Distribution</h3>
            </div>
            <span className="text-xs text-gray-500 font-mono">Dynamic Breakdown</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff'
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-gray-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">Application Pipeline</h3>
            </div>
            <span className="text-xs text-gray-500 font-mono">Counts per Stage</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis allowDecimals={false} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => {
                    const colors = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e'];
                    return <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Applications</h3>
            <p className="text-xs text-gray-400">Latest active internship & job logs</p>
          </div>
          <Link
            to="/applications"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All Applications
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No applications logged yet. Click "Log New Application" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800 bg-gray-900/40">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Company</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {recentApps.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{app.companyName}</td>
                    <td className="py-3.5 px-4 text-gray-300">{app.role}</td>
                    <td className="py-3.5 px-4 text-gray-400 text-xs">{formatDate(app.applicationDate)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStageBadgeClass(app.stage)}`}>
                        {app.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/applications/${app._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        View Details
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
