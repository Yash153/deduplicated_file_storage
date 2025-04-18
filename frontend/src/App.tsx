import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileUpload from './components/FileUpload';
import FileFiltersComponent from './components/FileFilters';
import FileListComponent from './components/FileList';
import StorageStatsComponent from './components/StorageStats';
import { useState } from 'react';
import type { FileFilters as FileFiltersType } from './types/file';

export const queryClient = new QueryClient();

function App() {
  const [filters, setFilters] = useState<FileFiltersType>({
    search: '',
    fileType: '',
    minSize: '',
    maxSize: '',
    startDate: '',
    endDate: '',
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Abnormal File Vault</h1>
            <p className="mt-2 text-lg text-gray-600">
              Efficient file storage with deduplication and smart search
            </p>
          </div>
          
          <div className="space-y-6">
            <StorageStatsComponent />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <FileUpload />
              </div>
              <div className="lg:col-span-2">
                <FileFiltersComponent onFilter={setFilters} />
              </div>
            </div>
            
            <FileListComponent filters={filters} />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;