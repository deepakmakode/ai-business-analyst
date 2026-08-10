import React from 'react';
import { PlanApprovalCard } from '../components/PlanApprovalCard';

export const ApprovalScreen: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white text-center">Approve Machine Learning Training Plan</h2>
      <PlanApprovalCard />
    </div>
  );
};
