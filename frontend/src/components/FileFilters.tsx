import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFileTypes } from '../services/fileService';
import type { FileFilters as FileFiltersType } from '../types/file';

interface FileFiltersProps {
  onFilter: (filters: FileFiltersType) => void;
}

const FileFiltersComponent = ({ onFilter }: FileFiltersProps) => {
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: fileTypes } = useQuery({
    queryKey: ['fileTypes'],
    queryFn: getFileTypes,
  });

  useEffect(() => {
    onFilter({
      search,
      fileType,
      minSize,
      maxSize,
      startDate,
      endDate,
    });
  }, [search, fileType, minSize, maxSize, startDate, endDate, onFilter]);

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filter Files</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Search files..."
          />
        </div>
        <div>
          <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            File Type
          </label>
          <select
            id="fileType"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Types</option>
            {fileTypes?.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="minSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Min Size (KB)
          </label>
          <input
            type="number"
            id="minSize"
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Min size..."
          />
        </div>
        <div>
          <label htmlFor="maxSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Max Size (KB)
          </label>
          <input
            type="number"
            id="maxSize"
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Max size..."
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FileFiltersComponent;