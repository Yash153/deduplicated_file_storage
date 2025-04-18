import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '../context/ThemeContext';
import { uploadFile } from '../services/fileService';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface UploadProgress {
  [key: string]: number;
}

const FileUpload: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const queryClient = useQueryClient();

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit';
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not allowed';
    }
    return null;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadPromises = acceptedFiles.map(async (file) => {
      const error = validateFile(file);
      if (error) {
        toast.error(`Error uploading ${file.name}: ${error}`);
        return;
      }

      try {
        const progressCallback = (progress: number) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        };

        await uploadFile(file);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Error uploading ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    await Promise.all(uploadPromises);
    setUploadProgress({});
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  }, [queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : `border-gray-300 dark:border-gray-600 hover:border-blue-500 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <p className="text-lg font-medium">
          {isDragActive ? 'Drop the files here' : 'Drag and drop files here, or click to select files'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supported formats: JPG, PNG, PDF, TXT, DOC, DOCX (Max 10MB)
        </p>
      </div>
      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="mt-4">
          <p className="text-sm mb-1">{fileName}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileUpload;