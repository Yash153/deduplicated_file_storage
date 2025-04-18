import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFileTypes } from '../services/fileService';
import type { FileFilters } from '../types/file';

interface FileFiltersProps {
  onFilter: (filters: FileFilters) => void;
}

const FileFiltersComponent = ({ onFilter }: FileFiltersProps) => {
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState('');
  const [minSize, setMinSize] = useState<number | undefined>(undefined);
  const [maxSize, setMaxSize] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: fileTypes, isLoading } = useQuery({
    queryKey: ['fileTypes'],
    queryFn: getFileTypes
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      search: search || undefined,
      fileType: fileType || undefined,
      minSize,
      maxSize,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
  };

  const handleSizeChange = (value: string, setter: (value: number | undefined) => void) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    setter(numValue);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
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
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Types</option>
            {isLoading ? (
              <option>Loading...</option>
            ) : (
              fileTypes?.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="minSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Min Size (KB)
          </label>
          <input
            type="number"
            id="minSize"
            value={minSize || ''}
            onChange={(e) => handleSizeChange(e.target.value, setMinSize)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Min size in KB"
          />
        </div>

        <div>
          <label htmlFor="maxSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Max Size (KB)
          </label>
          <input
            type="number"
            id="maxSize"
            value={maxSize || ''}
            onChange={(e) => handleSizeChange(e.target.value, setMaxSize)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Max size in KB"
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
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default FileFiltersComponent;