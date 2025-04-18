import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '../services/fileService';
import { useState, useRef } from 'react';

const FileUpload = () => {
  const queryClient = useQueryClient();
  const [uploadStatus, setUploadStatus] = useState<{ 
    isDuplicate: boolean; 
    message: string 
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      setUploadStatus({
        isDuplicate: data.is_duplicate,
        message: data.is_duplicate 
          ? 'Duplicate file detected. Storage optimized by referencing existing file.' 
          : 'File uploaded successfully!'
      });
      setTimeout(() => setUploadStatus(null), 3000);
    },
    onError: () => {
      setUploadStatus({
        isDuplicate: false,
        message: 'File upload failed. Please try again.'
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      mutation.mutate(e.target.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Files</h3>
      <div className="flex items-center gap-4">
        <label className="block w-full">
          <span className="sr-only">Choose file</span>
          <input 
            ref={fileInputRef}
            type="file" 
            onChange={handleFileChange}
            disabled={mutation.isPending}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
      </div>
      {mutation.isPending && (
        <div className="mt-2 text-sm text-blue-600">Uploading file...</div>
      )}
      {uploadStatus && (
        <div className={`mt-2 text-sm ${uploadStatus.isDuplicate ? 'text-yellow-600' : 'text-green-600'}`}>
          {uploadStatus.message}
        </div>
      )}
    </div>
  );
};

export default FileUpload;