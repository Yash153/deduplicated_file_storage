export interface FileType {
  id: number;
  name: string;
  file_type: string;
  size: number;
  upload_date: string;
  is_duplicate: boolean;
}

export interface FileFiltersType {
  search?: string;
  file_type?: string;
  min_size?: number;
  max_size?: number;
  start_date?: string;
  end_date?: string;
}

export interface StorageStats {
  total_files: number;
  unique_files: number;
  duplicate_files: number;
  storage_saved: number;
} 