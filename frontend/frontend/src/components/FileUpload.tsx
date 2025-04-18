import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '../services/fileService';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadProgress {
  [key: string]: number;
}

export const FileUpload: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const queryClient = useQueryClient();
  const { isDarkMode } = useTheme();

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit';
    }
    return null;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        continue;
      }

      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        await uploadFile(file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        });

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }
    }

    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  }, [queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE
  });

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 dark:text-gray-300">
          {isDragActive
            ? 'Drop the files here'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Maximum file size: 10MB
        </p>
      </div>

      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">{fileName}</span>
            <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}; 