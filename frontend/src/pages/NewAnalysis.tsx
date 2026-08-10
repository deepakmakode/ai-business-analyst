import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { TargetSelector } from '../components/TargetSelector';
import { useAppStore } from '../store/useAppStore';
import { captureUserIntent, generateMLPlan } from '../api/client';

export const NewAnalysis: React.FC = () => {
  const { uploadedDataset, targetColumn, setMLPlan, setCurrentTab, activeSessionId } = useAppStore();
  const [intentInput, setIntentInput] = useState('');
  const [capturedIntentText, setCapturedIntentText] = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);

  const handleCaptureIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentInput.trim()) return;

    setIntentLoading(true);
    try {
      const res = await captureUserIntent(intentInput, activeSessionId);
      setCapturedIntentText(res.response);
    } catch {
      setCapturedIntentText("Intent captured! Please upload your dataset below.");
    } finally {
      setIntentLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    if (!uploadedDataset || !targetColumn) return;
    try {
      const plan = await generateMLPlan(activeSessionId, uploadedDataset.dataset_id, targetColumn);
      setMLPlan(plan);
      setCurrentTab('approval');
    } catch {
      alert("Failed to generate plan.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Phase 1: Intent Capture & Dataset Upload</h2>
      </div>

      {/* Step 2: Intent Capture AI Chat Box */}
      <div className="glass-card p-5 space-y-3 border-l-4 border-cyan-400">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
          <span>🤖 Intent Capture AI:</span>
          <span className="text-slate-300 font-normal text-xs">"What would you like to analyze?"</span>
        </div>
        
        <form onSubmit={handleCaptureIntent} className="flex gap-2">
          <input
            type="text"
            value={intentInput}
            onChange={(e) => setIntentInput(e.target.value)}
            placeholder="e.g., Predict TV sales or Forecast next quarter revenue..."
            className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={intentLoading}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-lg font-semibold text-sm transition"
          >
            {intentLoading ? "Parsing Intent..." : "Set Goal"}
          </button>
        </form>

        {capturedIntentText && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-200">
            {capturedIntentText}
          </div>
        )}
      </div>
      
      {/* Step 3: Dataset Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload />
        
        {uploadedDataset && (
          <div className="space-y-4">
            <div className="glass-card p-4 text-xs space-y-2">
              <div className="font-bold text-cyan-400 text-sm">✅ Dataset Uploaded: {uploadedDataset.filename}</div>
              <div>Rows: {uploadedDataset.row_count} | Columns: {uploadedDataset.col_count}</div>
              {uploadedDataset.pii_masked_cols.length > 0 && (
                <div className="text-amber-400">🛡️ Masked PII Columns: {uploadedDataset.pii_masked_cols.join(', ')}</div>
              )}
            </div>

            <TargetSelector />

            {targetColumn && (
              <button
                onClick={handleCreatePlan}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg text-sm transition"
              >
                Generate AutoML Plan for "{targetColumn}" →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
