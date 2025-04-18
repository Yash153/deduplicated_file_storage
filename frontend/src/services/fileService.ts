import axios from 'axios';
import { FileResponse, StorageStats, FileFilters } from '../types/file';

const API_URL = process.env.REACT_APP_API_URL;

export const uploadFile = async (file: File): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post<FileResponse>(`${API_URL}/files/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
  });
  return response.data;
};

export const getFiles = async (filters: FileFilters = {}): Promise<FileResponse[]> => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.fileType) params.append('file_type', filters.fileType);
  if (filters.minSize) params.append('min_size', filters.minSize);
  if (filters.maxSize) params.append('max_size', filters.maxSize);
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);

  const response = await axios.get<FileResponse[]>(`${API_URL}/files/`, { params });
  return response.data;
};

export const getFileTypes = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(`${API_URL}/files/file_types/`);
  return response.data;
};

export const deleteFile = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/files/${id}/`);
};

export const getStorageStats = async (): Promise<StorageStats> => {
  const response = await axios.get<StorageStats>(`${API_URL}/files/stats/`);
  return response.data;
};

export const downloadFile = async (fileUrl: string, fileName: string): Promise<void> => {
  const response = await axios.get(fileUrl, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};