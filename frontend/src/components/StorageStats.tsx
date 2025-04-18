import { useQuery } from '@tanstack/react-query';
import { getStorageStats } from '../services/fileService';
import type { StorageStats as StorageStatsType } from '../types/file';

const StorageStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: getStorageStats,
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    
    return `${value} ${sizes[i]}`;
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading storage statistics...</div>;
  if (error) return <div className="p-4 text-center text-red-500 dark:text-red-400">Error loading storage statistics</div>;

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg shadow">
      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">Storage Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Files</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_files || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Unique Files</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.unique_files || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duplicate Files</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.duplicate_files || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Storage Saved</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.storage_saved ? formatBytes(stats.storage_saved) : '0 Bytes'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageStats;