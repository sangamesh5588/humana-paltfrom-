import { useState, useEffect, useCallback } from 'react';
import useExpertStore from '../../../shared/store/expertStore';

export const useExpertDashboard = () => {
  const { overview, isLoading, fetchHomeOverview } = useExpertStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleFetch = useCallback(async () => {
    await fetchHomeOverview();
  }, [fetchHomeOverview]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await handleFetch();
    setRefreshing(false);
  };

  return {
    overview,
    isLoading,
    refreshing,
    onRefresh,
    stats: {
      earnings: 0,
      completedSessions: 0,
      rating: 0,
      badgeCount: overview?.badges?.length || 0,
    },
  };
};

export default useExpertDashboard;
