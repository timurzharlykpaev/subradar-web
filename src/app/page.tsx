'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Radar,
  Mic,
  Camera,
  Bell,
  FileText,
  CreditCard,
  ArrowRight,
  Check,
  Moon,
  Sun,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const features = [
  {
    icon: Mic,
    title: 'AI Voice Add',
    desc: 'Just say "I pay $15 for Netflix monthly" — AI extracts all the details instantly.',
    color: '#8B5CF6',
  },
  {
    icon: Camera,
    title: 'Screenshot Recognition',
    desc: 'Upload a receipt or confirmation email screenshot — we\'ll read it for you.',
    color: '#10B981',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    desc: 'Get notified before renewals so you\'re never caught off guard again.',
    color: '#F59E0B',
  },
  {
    icon: FileText,
    title: 'Tax Reports',
    desc: 'Export business subscriptions in PDF/CSV for easy tax filing.',
    color: '#EF4444',
  },
  {
    icon: CreditCard,
    title: 'Card Tracking',
    desc: 'See which card pays for what. Organize by card, category, or amount.',
    color: '#3B82F6',
  },
  {
    icon: Zap,
    title: 'Spend Insights',
    desc: 'AI detects duplicate subscriptions and suggests where to cut costs.',
    color: '#EC4899',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Up to 5 subscriptions', 'Basic dashboard', 'Manual entry only', 'Email reminders'],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$2.99',
    period: '/month',
    yearlyPrice: '$24.99/year',
    features: [
      'Unlimited subscriptions',
      'AI voice & screenshot add',
      'PDF & CSV reports',
      'Tax reports',
      'Priority support',
      'Multiple cards',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
  },
];

// Animated demo subscription list
const demoSubs = [
  { name: 'Netflix', amount: '$15.99', icon: '🎬', days: 3 },
  { name: 'ChatGPT Plus', amount: '$20.00', icon: '🤖', days: 12 },
  { name: 'Spotify', amount: '$9.99', icon: '🎵', days: 1 },
  { name: 'GitHub', amount: '$4.00', icon: '☁️', days: 8 },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <div className="min-h-screen" style={{ background: theme === 'dark' ? '#0f0f13' : '#ffffff' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">SubRadar</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-all">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-gray-400" /> : <Moon className="w-4 h-4 text-gray-400" />}
            </button>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-all">
              Sign in
            </Link>
            <Link
              href="/app/dashboard"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-all"
            >
              Open App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Subscription Tracker
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Know exactly where{' '}
            <span className="gradient-text">your money goes</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Track all your subscriptions with AI. Add by voice, scan receipts,
            get reminders before renewals, and generate tax reports — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/app/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base transition-all shadow-lg shadow-purple-500/30"
            >
              Open Web App
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#'}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-base transition-all border border-white/10"
            >
              🍎 App Store
            </a>
            <a
              href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#'}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-base transition-all border border-white/10"
            >
              🤖 Google Play
            </a>
          </div>

          {/* Animated demo */}
          <div className="glass-card rounded-3xl p-6 max-w-sm mx-auto animate-pulse-glow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400">Monthly Spend</p>
                <p className="text-3xl font-bold gradient-text">$69.98</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Active</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
            <div className="space-y-2">
              {demoSubs.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{sub.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{sub.name}</p>
                      <p className={`text-xs ${sub.days <= 3 ? 'text-red-400' : 'text-gray-500'}`}>
                        {sub.days === 1 ? 'Tomorrow' : `In ${sub.days} days`}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-purple-400">{sub.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-400">Powerful features to take control of your subscriptions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400">Start free, upgrade when you need more</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-purple-600/20 to-violet-600/10 border border-purple-500/50'
                    : 'glass-card'
                }`}
              >
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-medium mb-3">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold gradient-text">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                {plan.yearlyPrice && (
                  <p className="text-sm text-green-400 mb-4">or {plan.yearlyPrice} — save 30%</p>
                )}
                <ul className="space-y-3 mb-6 mt-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.highlight ? '/login' : '/login'}
                  className={`block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div
          className="max-w-2xl mx-auto rounded-3xl p-12"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(16,185,129,0.1) 100%)', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <h2 className="text-3xl font-bold mb-4">Start tracking today</h2>
          <p className="text-gray-400 mb-8">Join thousands of users who know exactly where their money goes.</p>
          <Link
            href="/app/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base transition-all shadow-lg shadow-purple-500/30"
          >
            Open Web App — It&apos;s Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center">
              <Radar className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold gradient-text">SubRadar AI</span>
          </div>
          <p className="text-xs text-gray-500">© 2025 SubRadar. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-all">Privacy</a>
            <a href="#" className="hover:text-white transition-all">Terms</a>
            <a href="#" className="hover:text-white transition-all">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
