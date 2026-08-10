import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const SWOT: React.FC = () => {
  const { targetColumn, activeInsights } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Top Executive Diagnosis Card */}
      <div className="bg-[#0b1426] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg text-cyan-400 text-xs font-bold tracking-wide uppercase mb-4">
          <span>🧠</span> AI GENERATED EXECUTIVE DIAGNOSIS
        </div>

        {/* Main Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Executive Financial Overview
          </h2>
          {targetColumn && (
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1 rounded-xl">
              Target Analyzed: "{targetColumn}"
            </span>
          )}
        </div>

        {/* Diagnostic Paragraphs */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            {activeInsights.trajectoryText}
          </p>
          <p className="whitespace-pre-line">
            {activeInsights.marginsText}
          </p>
          <p className="whitespace-pre-line">
            {activeInsights.efficiencyText}
          </p>
        </div>
      </div>

      {/* 2x2 SWOT Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="bg-[#0b1426] border border-emerald-500/30 rounded-2xl p-5 hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base mb-4">
            <span className="text-lg">🛡️</span> Strengths (Internal)
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {activeInsights.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-white">{item.title}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="bg-[#0b1426] border border-rose-500/30 rounded-2xl p-5 hover:border-rose-500/50 transition-all duration-300">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base mb-4">
            <span className="text-lg">⚠️</span> Weaknesses (Internal)
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {activeInsights.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong className="text-white">{item.title}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities Card */}
        <div className="bg-[#0b1426] border border-cyan-500/30 rounded-2xl p-5 hover:border-cyan-500/50 transition-all duration-300">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base mb-4">
            <span className="text-lg">🚀</span> Opportunities (External)
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {activeInsights.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong className="text-white">{item.title}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats Card */}
        <div className="bg-[#0b1426] border border-amber-500/30 rounded-2xl p-5 hover:border-amber-500/50 transition-all duration-300">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-4">
            <span className="text-lg">🛑</span> Threats (External)
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            {activeInsights.threats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-white">{item.title}</strong> {item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
