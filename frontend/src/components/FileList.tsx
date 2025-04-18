import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFiles } from '../services/fileService';
import type { FileResponse, FileFilters, PaginatedResponse } from '../types/file';
import { useTheme } from '../context/ThemeContext';

interface FileListProps {
  filters: FileFilters;
}

type SortField = 'name' | 'file_type' | 'size' | 'upload_date' | 'is_duplicate';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const FileList = ({ filters }: FileListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('upload_date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const { isDarkMode } = useTheme();

  const { data, isLoading, error: queryError } = useQuery<PaginatedResponse<FileResponse>>({
    queryKey: ['files', filters, currentPage, sortField, sortOrder],
    queryFn: () => getFiles(filters, currentPage, ITEMS_PER_PAGE, sortField, sortOrder)
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading files...</div>;
  if (queryError) return <div className="p-4 text-center text-red-500 dark:text-red-400">Error loading files</div>;
  if (!data?.results.length) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">No files found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('file_type')}
            >
              Type {sortField === 'file_type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('size')}
            >
              Size {sortField === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('upload_date')}
            >
              Upload Date {sortField === 'upload_date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('is_duplicate')}
            >
              Status {sortField === 'is_duplicate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.results.map((file) => (
            <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {file.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {file.file_type?.toUpperCase() || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatBytes(file.size)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(file.upload_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  !file.is_duplicate
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {file.is_duplicate ? 'Duplicate' : 'Unique'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.pages > 1 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {currentPage} of {data.pages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.pages))}
            disabled={currentPage === data.pages}
            className="px-4 py-2 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FileList;