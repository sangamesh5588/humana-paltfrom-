import { useState } from 'react';
import { ExpertEarningStat, PayoutTransaction } from '../../../shared/types/expert.types';

export const useExpertEarnings = () => {
  const [stats] = useState<ExpertEarningStat>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayout: 0,
    completedSessionsCount: 0,
    avgRating: 0,
    monthlyGrowthPercent: 0,
  });

  const [transactions] = useState<PayoutTransaction[]>([]);

  return {
    stats,
    transactions,
  };
};

export default useExpertEarnings;
