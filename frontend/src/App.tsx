import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Dashboard } from './pages/Dashboard';
import { DataCSV } from './pages/DataCSV';
import { SWOT } from './pages/SWOT';
import { Simulator } from './pages/Simulator';
import { ChatConversation } from './pages/ChatConversation';
import { Reports } from './pages/Reports';

export const App: React.FC = () => {
  const { currentTab, setCurrentTab, selectedDataset, setSelectedDataset, resetDataset } = useAppStore();

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Outer Header Card matching Image 2 */}
        <div className="bg-[#0b1426] border border-slate-800/80 rounded-2xl p-4 shadow-2xl">
          {/* Top Row: Logo/Brand & Nav Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
                📈
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-white tracking-tight">AI Business Analyst</h1>
                  <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Multi-Industry Analytics & Executive Decision Suite</p>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="flex bg-[#070d19] p-1.5 rounded-xl border border-slate-800 flex-wrap gap-1">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentTab === 'dashboard'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📊</span> Dashboard
              </button>

              <button
                onClick={() => setCurrentTab('data')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentTab === 'data'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📁</span> Data & CSV
              </button>

              <button
                onClick={() => setCurrentTab('swot')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentTab === 'swot'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🧠</span> AI Insights & SWOT
              </button>

              <button
                onClick={() => setCurrentTab('simulator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentTab === 'simulator'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎛️</span> What-If Simulator
              </button>

              <button
                onClick={() => setCurrentTab('chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentTab === 'chat'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>💬</span> AI Analyst Chat
              </button>

              <button
                onClick={() => setCurrentTab('reports')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  currentTab === 'reports'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📄</span> Reports
              </button>
            </nav>
          </div>

          {/* Sub Header Row */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#070d19] border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">Dataset:</span>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="General Business" className="bg-slate-900 text-white">📊 General Business</option>
                <option value="Financial Operations" className="bg-slate-900 text-white">📈 Financial Operations</option>
                <option value="SaaS Metrics" className="bg-slate-900 text-white">💻 SaaS Metrics</option>
              </select>
            </div>

            <button
              onClick={resetDataset}
              className="bg-[#070d19] hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 font-medium"
            >
              <span>🔄</span> Reset Dataset
            </button>
          </div>
        </div>

        {/* Page Content Rendering */}
        <main>
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'data' && <DataCSV />}
          {currentTab === 'swot' && <SWOT />}
          {currentTab === 'simulator' && <Simulator />}
          {currentTab === 'chat' && <ChatConversation />}
          {currentTab === 'reports' && <Reports />}
        </main>
      </div>
    </div>
  );
};

export default App;
