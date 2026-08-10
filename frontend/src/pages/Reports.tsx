import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const Reports: React.FC = () => {
  const { targetColumn, activeInsights } = useAppStore();
  const r = activeInsights.report;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0b1426] border border-cyan-500/30 p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Executive Business Reports</h2>
          <p className="text-xs text-slate-400 mt-1">
            Plain-English AI financial diagnosis and strategic decision roadmap for business leaders.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs border border-slate-700 transition flex items-center gap-2"
        >
          <span>🖨️</span> Export PDF Report
        </button>
      </div>

      <div className="bg-[#0b1426] border border-slate-800 p-8 rounded-2xl space-y-6 text-xs text-slate-300">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">CONFIDENTIAL EXECUTIVE REPORT</div>
            <h3 className="text-xl font-bold text-white mt-1">{r.title}</h3>
            <div className="text-[11px] text-slate-500 mt-1">
              Generated on: August 5, 2026 • Target Variable Analyzed: <strong className="text-cyan-400">"{targetColumn || 'Revenue'}"</strong>
            </div>
          </div>
          {targetColumn && (
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1 rounded-xl">
              Target: {targetColumn}
            </span>
          )}
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">1. Executive Summary</h4>
          <p className="leading-relaxed">
            {r.summary}
          </p>
        </div>

        {/* Section 2: Key Business Metrics Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">2. Key Financial Indicators & Target Metrics</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2">Business Metric</th>
                  <th className="py-2">Analyzed Value</th>
                  <th className="py-2">Benchmark / Target</th>
                  <th className="py-2">Business Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <tr className="text-white font-medium">
                  <td className="py-2 font-bold text-cyan-400">Target Metric ({targetColumn || 'Revenue'})</td>
                  <td className="py-2">$1,978,000</td>
                  <td className="py-2">+91.7% Growth</td>
                  <td className="py-2 text-emerald-400">High Growth Trajectory</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="py-2 font-bold text-emerald-400">Gross Margin</td>
                  <td className="py-2">67.2%</td>
                  <td className="py-2">&gt; 65.0% Industry Avg</td>
                  <td className="py-2 text-emerald-400">Strong Unit Economics</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="py-2 font-bold text-cyan-300">Net Profit Margin</td>
                  <td className="py-2">20.2% ($418,000)</td>
                  <td className="py-2">18.0% Baseline Target</td>
                  <td className="py-2 text-emerald-400">Healthy Cash Generation</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="py-2 font-bold text-amber-400">Customer Acquisition Cost (CAC)</td>
                  <td className="py-2">$167 avg</td>
                  <td className="py-2">&lt; $150 Target</td>
                  <td className="py-2 text-amber-400">Requires Channel Optimization</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="py-2 font-bold text-blue-400">Active Customer Count</td>
                  <td className="py-2">2,870 Users</td>
                  <td className="py-2">+25% Growth MoM</td>
                  <td className="py-2 text-emerald-400">Expanding Market Share</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Cost Structure & Profit Drivers */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">3. Cost Drivers & Profit Optimization Strategy</h4>
          <p className="leading-relaxed">
            • <strong className="text-white">Cost of Goods Sold (COGS):</strong> COGS represents the largest expense (~42% of revenue). Implementing automated inventory and fulfillment routing is projected to lower COGS ratio by <strong className="text-emerald-400">4-6%</strong>, adding ~$41,500 in annual bottom-line profit.
            <br />
            • <strong className="text-white">Marketing Efficiency:</strong> Digital advertising spend accounts for ~28% of operating expenses. Reallocating budget toward high-LTV organic and referral channels will stabilize CAC at <strong className="text-cyan-400">$138</strong> and expand net profit margin to <strong className="text-emerald-400">23.5%</strong>.
          </p>
        </div>

        {/* Section 4: Executive Action Plan */}
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">4. Strategic Action Plan & Next Steps</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#070d19] border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-cyan-400">1. Upsell Active Customer Base</div>
              <p className="text-[11px] text-slate-400">Introduce tiered analytics modules to top 20% active accounts to increase average revenue per user (ARPU).</p>
            </div>
            <div className="bg-[#070d19] border border-slate-800 p-4 rounded-xl space-y-1">
              <div className="text-xs font-bold text-emerald-400">2. Optimize Acquisition Channels</div>
              <p className="text-[11px] text-slate-400">Cap maximum bid limits on paid ad networks to eliminate CAC spikes above $200 during promotional pushes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
