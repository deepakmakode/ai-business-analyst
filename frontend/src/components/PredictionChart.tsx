import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { month: 'Jan', revenue: 120000 },
  { month: 'Feb', revenue: 128000 },
  { month: 'Mar', revenue: 135000 },
  { month: 'Apr', revenue: 142000 },
  { month: 'May', revenue: 138000 },
  { month: 'Jun', revenue: 155000 },
  { month: 'Jul (Forecast)', revenue: 168000 },
  { month: 'Aug (Forecast)', revenue: 175000 },
];

export const PredictionChart: React.FC = () => {
  return (
    <div className="glass-card p-4 h-[300px] flex flex-col">
      <h3 className="text-sm font-semibold text-white mb-2">📈 Financial Trend Trajectory</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
            <Line type="monotone" dataKey="revenue" stroke="#00f2fe" strokeWidth={3} dot={{ r: 4, fill: '#00f2fe' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
