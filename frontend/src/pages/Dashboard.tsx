import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { fetchUserSessions } from '../api/client';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const trajectoryData = [
  { month: 'Jan', revenue: 140000, expenses: 112000, profit: 28000, margin: 20 },
  { month: 'Feb', revenue: 152000, profit: 25000, margin: 16.4, expenses: 127000 },
  { month: 'Mar', revenue: 160000, expenses: 125000, profit: 35000, margin: 21.8 },
  { month: 'Apr', revenue: 172000, expenses: 134000, profit: 38000, margin: 22.1 },
  { month: 'May', revenue: 185000, expenses: 142000, profit: 43000, margin: 23.2 },
  { month: 'Jun', revenue: 197000, profit: 38800, margin: 19.7, expenses: 158200 },
  { month: 'Jul', revenue: 205000, expenses: 155000, profit: 50000, margin: 24.4 },
];

export const Dashboard: React.FC = () => {
  const { setCurrentTab } = useAppStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const res = await fetchUserSessions();
      setSessions(res.sessions || []);
      setLoading(false);
    }
    loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="animate-spin text-3xl mb-2">⚡</div>
        <p className="text-xs font-semibold">Loading Workspace Sessions...</p>
      </div>
    );
  }

  // FIRST-TIME LOGIN / EMPTY STATE (0 Previous Projects)
  if (sessions.length === 0) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        {/* Welcome Banner */}
        <div className="glass-card p-8 border-l-4 border-cyan-400 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 text-3xl font-black shadow-lg shadow-cyan-500/20">
            ⚡
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Welcome to Conversational AutoML Pro!</h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto mt-1">
              You haven't created any business analysis projects yet. Start by creating your first AI-driven AutoML project below.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setCurrentTab('new-analysis')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-cyan-500/25"
            >
              + Create First Project / Analysis
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="glass-card p-5 space-y-2">
            <div className="text-cyan-400 text-base font-bold">💬 Conversational Intent AI</div>
            <p className="text-slate-400">Simply chat with the AI to explain what you want to predict (e.g. "Predict TV Sales").</p>
          </div>
          <div className="glass-card p-5 space-y-2">
            <div className="text-emerald-400 text-base font-bold">🛡️ Automated PII Masking</div>
            <p className="text-slate-400">Upload your CSV/Excel datasets safely with automated Presidio sensitive data anonymization.</p>
          </div>
          <div className="glass-card p-5 space-y-2">
            <div className="text-purple-400 text-base font-bold">🤖 AutoML & Local RAG</div>
            <p className="text-slate-400">Train multiple candidate ML algorithms, save .pkl artifacts, and query your RAG Knowledge Base.</p>
          </div>
        </div>
      </div>
    );
  }

  // RETURNING USER STATE (Previous Saved Projects Exist)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Workspace Session History</h1>
          <p className="text-xs text-slate-400">You have {sessions.length} active analysis projects saved.</p>
        </div>
        <button
          onClick={() => setCurrentTab('new-analysis')}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition"
        >
          + New AutoML Analysis
        </button>
      </div>

      {/* Saved Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessions.map((s) => (
          <div key={s.id} className="glass-card p-5 space-y-3 border-l-4 border-cyan-400">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-mono">{s.id}</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">{s.status}</span>
            </div>
            <div className="font-bold text-white text-base">{s.title || "Business Project"}</div>
            {s.user_intent && (
              <div className="text-xs text-cyan-300 bg-cyan-500/10 p-2 rounded border border-cyan-500/20">
                Target Entity: <strong>{s.user_intent.target_entity}</strong> ({s.user_intent.task})
              </div>
            )}
            <button
              onClick={() => setCurrentTab('results')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-1.5 rounded text-xs transition border border-white/10"
            >
              Open Previous Report →
            </button>
          </div>
        ))}
      </div>

      {/* Charts View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#0b1426] border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue vs Expenses Trajectory</h3>
              <p className="text-[11px] text-slate-400">Saved project trajectory data</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162032" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1527', borderColor: '#1e2d4a', borderRadius: '0.75rem' }} />
                <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} />
                <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0b1426] border border-slate-800 p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Net Profit Trend</h3>
            <p className="text-[11px] text-slate-400">Monthly net profit margin %</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162032" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1527', borderColor: '#1e2d4a' }} />
                <Bar yAxisId="left" dataKey="profit" fill="#10b981" />
                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#a855f7" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
