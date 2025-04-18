import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../services/fileService';
import { useQueryClient } from '@tanstack/react-query';

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        await uploadFile(file);
      }
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="mb-6">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
          }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="text-gray-600 dark:text-gray-300">
            <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm">
              {isDragActive
                ? 'Drop the files here'
                : 'Drag and drop files here, or click to select files'
              }
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: Any file type
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;