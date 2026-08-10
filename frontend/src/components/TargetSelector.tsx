import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const TargetSelector: React.FC = () => {
  const { uploadedDataset, targetColumn, setTargetColumn } = useAppStore();
  const [selectedProductMode, setSelectedProductMode] = useState<string>('combine');

  if (!uploadedDataset) return null;

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Step 6: Domain & Inferred Task Badge */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <span className="text-xs text-slate-400">Detected Business Domain:</span>
        <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded font-bold">
          🏢 {uploadedDataset.domain || "General Business"}
        </span>
        <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs px-2.5 py-0.5 rounded font-bold">
          ⚡ Task Type: {uploadedDataset.inferred_task || "Regression"}
        </span>
      </div>

      {/* Step 7: Multi-Product Handling Decision */}
      {uploadedDataset.has_multiple_products && (
        <div className="space-y-2 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <span>📦 Multiple Products Detected in Dataset:</span>
            <span className="text-white">{uploadedDataset.product_list.slice(0, 3).join(', ')}...</span>
          </div>
          <p className="text-[11px] text-amber-200/80">How would you like the AI to handle multiple products? (Business Decision):</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            {uploadedDataset.multi_product_options.map((opt: any) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedProductMode(opt.id)}
                className={`p-2 rounded-lg text-xs font-semibold text-left transition border ${
                  selectedProductMode === opt.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 8: Human-in-the-Loop Target Selection */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-cyan-400 text-sm">🎯 Target Variable Selection (Human-in-the-Loop)</h3>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
            AI Never Auto-Selects
          </span>
        </div>
        <p className="text-xs text-slate-300">AI identified target candidates below. Click to confirm which column you want to predict:</p>
        
        <div className="flex flex-wrap gap-2 pt-1">
          {uploadedDataset.columns.map((col: any) => (
            <button
              key={col.name}
              type="button"
              onClick={() => setTargetColumn(col.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                targetColumn === col.name
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
              }`}
            >
              {col.name} {col.is_target_candidate ? '⭐' : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
