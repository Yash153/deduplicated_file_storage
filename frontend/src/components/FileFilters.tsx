import { useQuery } from '@tanstack/react-query';
import { getFileTypes } from '../services/fileService';
import { useState } from 'react';
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

  const { data: fileTypes = [] } = useQuery({
    queryKey: ['fileTypes'],
    queryFn: getFileTypes,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      search,
      fileType,
      minSize,
      maxSize,
      startDate,
      endDate,
    });
  };

  const handleReset = () => {
    setSearch('');
    setFileType('');
    setMinSize('');
    setMaxSize('');
    setStartDate('');
    setEndDate('');
    onFilter({});
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Files</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by name</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter file name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File type</label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All types</option>
              {fileTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size range (KB)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload date range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileFiltersComponent;