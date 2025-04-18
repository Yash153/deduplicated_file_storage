export interface FileResponse {
  id: number;
  name: string;
  file_type: string;
  size: number;
  upload_date: string;
  is_duplicate: boolean;
  original_file?: number;
  hash?: string;
}

export interface StorageStats {
  total_files: number;
  unique_files: number;
  duplicate_files: number;
  storage_saved: number;
}

export interface FileFilters {
  search?: string;
  fileType?: string;
  minSize?: number;
  maxSize?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  pages: number;
  current_page: number;
}