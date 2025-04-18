import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StorageStats from '../StorageStats';
import { ThemeProvider } from '../../context/ThemeContext';

const mockStats = {
  total_files: 5,
  unique_files: 3,
  duplicate_files: 2,
  storage_saved: 2048
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('StorageStats', () => {
  beforeEach(() => {
    // Mock the getStorageStats function
    jest.spyOn(require('../../services/fileService'), 'getStorageStats').mockResolvedValue(mockStats);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('renders loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StorageStats />
        </ThemeProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText('Loading storage statistics...')).toBeInTheDocument();
  });

  it('renders stats correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StorageStats />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // Total files
      expect(screen.getByText('3')).toBeInTheDocument(); // Unique files
      expect(screen.getByText('2')).toBeInTheDocument(); // Duplicate files
      expect(screen.getByText('2 KB')).toBeInTheDocument(); // Storage saved
    });
  });

  it('handles error state', async () => {
    jest.spyOn(require('../../services/fileService'), 'getStorageStats').mockRejectedValue(new Error('Failed to fetch'));

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StorageStats />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading storage statistics')).toBeInTheDocument();
    });
  });

  it('formats storage saved correctly', async () => {
    const largeStats = {
      ...mockStats,
      storage_saved: 1024 * 1024 * 2.5 // 2.5 MB
    };
    jest.spyOn(require('../../services/fileService'), 'getStorageStats').mockResolvedValue(largeStats);

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <StorageStats />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2.5 MB')).toBeInTheDocument();
    });
  });
}); 