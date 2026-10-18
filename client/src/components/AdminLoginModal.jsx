import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, X, KeyRound, Mail, Sparkles, AlertCircle } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose }) => {
  const { login, quickAdminLogin } = useAuth();
  const [email, setEmail] = useState('admin@radiant.music');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      await quickAdminLogin();
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#090f20] border border-sky-500/30 shadow-2xl p-6 lg:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 via-sky-400 to-blue-600 p-0.5 shadow-glow-sky flex items-center justify-center">
            <div className="w-full h-full bg-[#070b16] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-sky-400" />
            </div>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            Administrator Authentication
          </h3>
          <p className="text-xs text-slate-400">
            Sign in to access Multer music uploads, Apple/Spotify catalog imports, and library controls.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@radiant.music"
                className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/70" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold tracking-wider uppercase shadow-glow-sky hover:opacity-95 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        {/* 1-Click Demo Login */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-2">
          <span className="text-[11px] text-slate-400 block">Instant Evaluation Demo:</span>
          <button
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold shadow-glow-crimson hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Demo Admin Login (admin123)
          </button>
        </div>

      </div>
    </div>
  );
};
