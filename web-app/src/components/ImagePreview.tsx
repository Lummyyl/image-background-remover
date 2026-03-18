'use client';

import { useState } from 'react';
import type { ProcessedImage } from '@/types/image';

interface ImagePreviewProps {
  image: ProcessedImage;
  onReset: () => void;
}

export default function ImagePreview({ image, onReset }: ImagePreviewProps) {
  const [activeTab, setActiveTab] = useState<'result' | 'comparison'>('result');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = image.downloadUrl;
    link.download = `no-background-${image.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('result')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'result'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Result
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'comparison'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Compare
        </button>
      </div>

      {/* Image Display */}
      <div className="relative">
        {activeTab === 'result' && (
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <img
              src={image.processedUrl}
              alt="Processed"
              className="w-full h-auto"
            />
          </div>
        )}
        
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Original</p>
              <img
                src={image.originalUrl}
                alt="Original"
                className="w-full h-auto border border-gray-300 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Processed</p>
              <img
                src={image.processedUrl}
                alt="Processed"
                className="w-full h-auto border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Filename</p>
            <p className="font-medium">{image.filename}</p>
          </div>
          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-medium">{formatFileSize(image.size)}</p>
          </div>
          <div>
            <p className="text-gray-500">Format</p>
            <p className="font-medium">{image.format.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-gray-500">Processing Time</p>
            <p className="font-medium">{image.processingTime}ms</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadImage}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Result
        </button>
        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Upload New Image
        </button>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Background removed successfully!
            </p>
            <p className="text-sm text-green-700 mt-1">
              Your image is ready for download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}