import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { approveMLPlan, startMLTraining } from '../api/client';

export const PlanApprovalCard: React.FC = () => {
  const { mlPlan, setTrainedModel, setCurrentTab } = useAppStore();
  const [loading, setLoading] = useState(false);

  if (!mlPlan) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveMLPlan(mlPlan.id);
      const res = await startMLTraining(mlPlan.id);
      setTrainedModel(res.best_model);
      setCurrentTab('results');
    } catch {
      alert("Error approving plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-5 border-l-4 border-cyan-400 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div>
          <h3 className="font-bold text-white text-base">📋 Non-Technical ML Approval Screen</h3>
          <p className="text-[11px] text-slate-400">Business User Execution Strategy (No Technical Jargon)</p>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
          Expected Reliability: {mlPlan.reliability_score || "High"}
        </span>
      </div>

      {/* Fields Grid: Task Name & Target Metric */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
          <div className="text-slate-400 font-medium">Task Name</div>
          <div className="text-cyan-400 font-bold text-sm truncate">
            {mlPlan.task_type?.includes("Regression") ? "Sales Forecast" : "Business Prediction"}
          </div>
        </div>

        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-1">
          <div className="text-slate-400 font-medium">Target Metric</div>
          <div className="text-white font-bold text-sm truncate">{mlPlan.target_column}</div>
        </div>
      </div>

      {/* External Features Tags */}
      {mlPlan.external_features && mlPlan.external_features.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-300">Enriched External Features:</div>
          <div className="flex flex-wrap gap-1.5">
            {mlPlan.external_features.map((ef: string, idx: number) => (
              <span key={idx} className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                ✨ {ef}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Selected Predictive Features Tags */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-300">Predictive Dataset Features:</div>
        <div className="flex flex-wrap gap-1.5">
          {mlPlan.selected_features.map((f: string) => (
            <span key={f} className="bg-slate-800 text-slate-200 text-[11px] px-2.5 py-0.5 rounded border border-white/10">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Validation Strategy Info */}
      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-200 flex justify-between items-center">
        <span>🛡️ Validation Strategy: Time-Based Sequential Split</span>
        <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/20 px-2 py-0.5 rounded">No Data Leakage</span>
      </div>

      {/* Approval Button */}
      <button
        onClick={handleApprove}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black py-3 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20"
      >
        {loading ? "Training Candidates for Maximum Reliability..." : "Approve Plan & Train Model →"}
      </button>
    </div>
  );
};
