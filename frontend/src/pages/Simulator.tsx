import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const Simulator: React.FC = () => {
  const { targetColumn, activeInsights } = useAppStore();
  const sim = activeInsights.simulator;

  const [lever1, setLever1] = useState(15);
  const [lever2, setLever2] = useState(5);
  const [lever3, setLever3] = useState(30000);

  const baseVal = sim.baselineValue;
  const simulatedVal = Math.round(baseVal * (1 + lever1 / 100));
  const diffVal = simulatedVal - baseVal;

  return (
    <div className="space-y-6">
      <div className="bg-[#0b1426] border border-cyan-500/30 p-6 rounded-2xl">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
          <span>🎛️</span> Scenario Simulation Engine
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-white">What-If Executive Forecast Simulator</h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust strategy levers below to simulate real-time AI projections for <strong className="text-cyan-400">"{targetColumn || 'Target Metric'}"</strong>.
            </p>
          </div>
          {targetColumn && (
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1 rounded-xl">
              Target: {targetColumn}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sliders Panel */}
        <div className="bg-[#0b1426] border border-slate-800 p-6 rounded-2xl space-y-6 md:col-span-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            Strategy Levers
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>{sim.lever1Label}</span>
              <span className="text-cyan-400">+{lever1}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={lever1}
              onChange={(e) => setLever1(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>{sim.lever2Label}</span>
              <span className="text-emerald-400">-{lever2}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={lever2}
              onChange={(e) => setLever2(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>{sim.lever3Label}</span>
              <span className="text-purple-400">${lever3.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              value={lever3}
              onChange={(e) => setLever3(Number(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Projected Outcome Cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b1426] border border-cyan-500/40 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium mb-1">Baseline Metric ({sim.unitLabel})</div>
              <div className="text-3xl font-black text-cyan-400">${baseVal.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-2">Historical baseline benchmark</div>
            </div>

            <div className="bg-[#0b1426] border border-emerald-500/40 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium mb-1">Simulated Outcome Projection</div>
              <div className="text-3xl font-black text-emerald-400">${simulatedVal.toLocaleString()}</div>
              <div className="text-xs text-emerald-400 mt-2 font-semibold">+${diffVal.toLocaleString()} vs baseline</div>
            </div>
          </div>

          <div className="bg-[#0b1426] border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <span>💡</span> AI Executive Recommendation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {sim.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
