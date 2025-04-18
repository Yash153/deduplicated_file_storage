import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileList from '../FileList';
import { ThemeProvider } from '../../context/ThemeContext';

const mockFiles = {
  results: [
    {
      id: 1,
      name: 'test1.txt',
      file_type: 'txt',
      size: 1024,
      upload_date: '2024-01-01T00:00:00Z',
      is_duplicate: false
    },
    {
      id: 2,
      name: 'test2.pdf',
      file_type: 'pdf',
      size: 2048,
      upload_date: '2024-01-02T00:00:00Z',
      is_duplicate: true,
      original_file: 1
    }
  ],
  total: 2,
  pages: 1,
  current_page: 1
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockFilters = {
  search: '',
  fileType: '',
  minSize: undefined,
  maxSize: undefined,
  startDate: '',
  endDate: ''
};

describe('FileList', () => {
  beforeEach(() => {
    // Mock the getFiles function
    jest.spyOn(require('../../services/fileService'), 'getFiles').mockResolvedValue(mockFiles);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('renders loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FileList filters={mockFilters} />
        </ThemeProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText('Loading files...')).toBeInTheDocument();
  });

  it('renders files correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FileList filters={mockFilters} />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('test1.txt')).toBeInTheDocument();
      expect(screen.getByText('test2.pdf')).toBeInTheDocument();
      expect(screen.getByText('1 KB')).toBeInTheDocument();
      expect(screen.getByText('2 KB')).toBeInTheDocument();
      expect(screen.getByText('Unique')).toBeInTheDocument();
      expect(screen.getByText('Duplicate')).toBeInTheDocument();
    });
  });

  it('handles empty file list', async () => {
    jest.spyOn(require('../../services/fileService'), 'getFiles').mockResolvedValue({
      results: [],
      total: 0,
      pages: 0,
      current_page: 1
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FileList filters={mockFilters} />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No files found')).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    jest.spyOn(require('../../services/fileService'), 'getFiles').mockRejectedValue(new Error('Failed to fetch'));

    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FileList filters={mockFilters} />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading files')).toBeInTheDocument();
    });
  });
}); 