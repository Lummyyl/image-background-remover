'use client';

import { useRef, useState, ChangeEvent } from 'react';
import type { UploadResult } from '@/types/image';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      setUploadResult({
        success: false,
        url: '',
        filename: file.name,
        size: file.size,
        error: 'Please select a valid image file'
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('error');
      setUploadResult({
        success: false,
        url: '',
        filename: file.name,
        size: file.size,
        error: 'File size must be less than 10MB'
      });
      return;
    }

    setUploadStatus('uploading');
    setUploadResult({
      success: true,
      url: URL.createObjectURL(file),
      filename: file.name,
      size: file.size
    });

    // Simulate upload delay
    setTimeout(() => {
      onImageUpload(URL.createObjectURL(file));
      setUploadStatus('success');
    }, 1000);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-50'
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {/* Upload Text */}
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploadStatus === 'uploading' && 'Uploading...'}
              {uploadStatus === 'success' && 'Image Uploaded!'}
              {uploadStatus === 'error' && 'Upload Failed'}
              {uploadStatus === 'idle' && 'Drop your image here or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, WebP up to 10MB
            </p>
          </div>
          
          {/* Upload Button */}
          {uploadStatus === 'idle' && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {/* Upload Status */}
      {uploadResult && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {uploadStatus === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadResult.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadResult.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {uploadStatus === 'error' && uploadResult.error && (
              <button
                onClick={resetUpload}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}