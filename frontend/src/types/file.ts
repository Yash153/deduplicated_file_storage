export interface FileResponse {
  id: number;
  name: string;
  file: string;
  size: number;
  file_type: string;
  upload_date: string;
  is_duplicate: boolean;
  original_file: number | null;
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
  minSize?: string;
  maxSize?: string;
  startDate?: string;
  endDate?: string;
}