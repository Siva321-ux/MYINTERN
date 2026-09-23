import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-gray-800 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-500/30">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Student Account</h1>
          <p className="text-xs text-gray-400 mt-1">Start tracking internships & interviews in one place</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="alex@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
