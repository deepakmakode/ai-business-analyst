import React, { useState } from 'react';
import { uploadDataset } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const FileUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setUploadedDataset } = useAppStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);

    try {
      const res = await uploadDataset(file);
      setUploadedDataset(res);
    } catch {
      alert("Error uploading dataset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-cyan-400 cursor-pointer">
      <div className="text-4xl mb-2">📁</div>
      <h3 className="text-lg font-semibold text-white">Upload Business CSV / Excel</h3>
      <p className="text-xs text-slate-400 mb-4">Auto-detects data types, PII masking, and target variables</p>
      
      <label className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer">
        {loading ? "Processing..." : "Browse CSV File"}
        <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};
