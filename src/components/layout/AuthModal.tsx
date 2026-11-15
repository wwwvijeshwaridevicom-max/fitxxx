'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    authModalTab, 
    openAuthModal, 
    closeAuthModal, 
    login, 
    loginAsDemoAdmin, 
    register 
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        const res = await login(email, password);
        if (!res.success) setError(res.error || 'Login failed');
      } else {
        const res = await register(name, email, password);
        if (!res.success) setError(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={closeAuthModal} />

      <div className="relative w-full max-w-md bg-brand-charcoal border border-brand-surface-borderDark rounded-2xl shadow-2xl p-6 sm:p-8 text-white z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-surface-borderDark">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xl tracking-tight text-white">
              FIT<span className="text-brand-crimson">XXX</span>
            </span>
            <span className="text-xs font-mono text-neutral-400">/ SYNDICATE ACCESS</span>
          </div>
          <button onClick={closeAuthModal} className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-brand-surface-borderDark my-5">
          <button
            onClick={() => { openAuthModal('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-colors relative ${
              authModalTab === 'login' ? 'text-brand-crimson' : 'text-neutral-400 hover:text-white'
            }`}
          >
            SIGN IN
            {authModalTab === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-crimson" />}
          </button>
          <button
            onClick={() => { openAuthModal('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-colors relative ${
              authModalTab === 'register' ? 'text-brand-crimson' : 'text-neutral-400 hover:text-white'
            }`}
          >
            CREATE ACCOUNT
            {authModalTab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-crimson" />}
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-brand-crimson/10 border border-brand-crimson/30 text-brand-crimson text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">FULL NAME</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full bg-brand-black border border-brand-surface-borderDark rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@streetwear.com"
                className="w-full bg-brand-black border border-brand-surface-borderDark rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-brand-black border border-brand-surface-borderDark rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-crimson"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-50 text-white font-bold text-xs tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all mt-6"
          >
            <span>{loading ? 'AUTHENTICATING...' : authModalTab === 'login' ? 'SIGN IN' : 'JOIN THE SYNDICATE'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Demo Buttons for Fast Evaluation */}
        <div className="mt-6 pt-5 border-t border-brand-surface-borderDark space-y-2.5">
          <p className="text-[10px] font-mono uppercase text-neutral-400 text-center">Instant Evaluation Access</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => login('creator@fitxxx.com')}
              className="py-2 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold tracking-wider transition-colors"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={loginAsDemoAdmin}
              className="py-2 px-3 rounded bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
