'use client';

import { useState } from 'react';
import type { ProcessedImage, ProcessingOptions, ProcessResult } from '@/types/image';

interface BackgroundRemoverProps {
  originalImage: string | null;
  onProcessComplete: (result: ProcessedImage) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

export default function BackgroundRemover({
  originalImage,
  onProcessComplete,
  onError,
  isProcessing
}: BackgroundRemoverProps) {
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    algorithm: 'edge-detection',
    threshold: 0.5,
    feathering: 2,
    background: 'transparent'
  });

  const handleProcess = async () => {
    if (!originalImage) return;

    try {
      setIsProcessing(true);
      onError('');

      // Convert image to file
      const response = await fetch(originalImage);
      const blob = await response.blob();
      const file = new File([blob], 'input.png', { type: blob.type });

      // Process the image
      const result = await processImage(file, processingOptions);
      
      // Create processed image data
      const processedImage: ProcessedImage = {
        originalUrl: originalImage,
        processedUrl: result.url,
        downloadUrl: result.downloadUrl,
        filename: file.name,
        size: file.size,
        format: blob.type.split('/')[1].toUpperCase(),
        processingTime: result.processingTime,
        algorithm: processingOptions.algorithm
      };

      onProcessComplete(processedImage);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async (file: File, options: ProcessingOptions): Promise<ProcessResult> => {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;

          if (!ctx) {
            throw new Error('Canvas context not available');
          }

          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Apply background removal based on algorithm
          switch (options.algorithm) {
            case 'edge-detection':
              applyEdgeDetection(data, canvas.width, canvas.height, options.threshold);
              break;
            case 'color-based':
              applyColorBasedRemoval(data, canvas.width, canvas.height, options.threshold);
              break;
            case 'ml-based':
              // For MVP, we'll use edge detection as fallback
              applyEdgeDetection(data, canvas.width, canvas.height, options.threshold);
              break;
          }

          // Put processed image data back
          ctx.putImageData(imageData, 0, 0);

          // Apply feathering if needed
          if (options.feathering > 0) {
            applyFeathering(ctx, canvas.width, canvas.height, options.feathering);
          }

          // Convert to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            const processingTime = Date.now() - startTime;
            const url = URL.createObjectURL(blob);
            const downloadUrl = canvas.toDataURL('image/png');

            resolve({
              success: true,
              url,
              downloadUrl,
              processingTime
            });
          }, 'image/png');
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const applyEdgeDetection = (data: Uint8ClampedArray, width: number, height: number, threshold: number) => {
    // Simple edge detection algorithm
    const thresholdValue = Math.floor(threshold * 255);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      
      // Simple edge detection - remove background based on brightness
      if (brightness > thresholdValue) {
        // Make transparent
        data[i + 3] = 0;
      }
    }
  };

  const applyColorBasedRemoval = (data: Uint8ClampedArray, width: number, height: number, threshold: number) => {
    // Remove background based on color similarity
    const thresholdValue = Math.floor(threshold * 255);
    
    // Get the corner pixels as background reference
    const topLeft = { r: data[0], g: data[1], b: data[2] };
    const topRight = { r: data[4 * (width - 1)], g: data[4 * (width - 1) + 1], b: data[4 * (width - 1) + 2] };
    const bottomLeft = { r: data[4 * (width * (height - 1))], g: data[4 * (width * (height - 1)) + 1], b: data[4 * (width * (height - 1)) + 2] };
    
    // Average background color
    const avgBg = {
      r: Math.round((topLeft.r + topRight.r + bottomLeft.r) / 3),
      g: Math.round((topLeft.g + topRight.g + bottomLeft.g) / 3),
      b: Math.round((topLeft.b + topRight.b + bottomLeft.b) / 3)
    };
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate color difference
      const colorDiff = Math.sqrt(
        Math.pow(r - avgBg.r, 2) + 
        Math.pow(g - avgBg.g, 2) + 
        Math.pow(b - avgBg.b, 2)
      );
      
      // Remove if similar to background
      if (colorDiff < thresholdValue) {
        data[i + 3] = 0;
      }
    }
  };

  const applyFeathering = (ctx: CanvasRenderingContext2D, width: number, height: number, featherAmount: number) => {
    // Simple feathering effect
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        
        if (alpha > 0 && alpha < 255) {
          // Apply feathering around edges
          const featherPixels = Math.min(featherAmount, 5);
          
          for (let dy = -featherPixels; dy <= featherPixels; dy++) {
            for (let dx = -featherPixels; dx <= featherPixels; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIndex = (ny * width + nx) * 4;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= featherPixels) {
                  const featherAlpha = alpha * (1 - distance / featherPixels);
                  data[nIndex + 3] = Math.max(data[nIndex + 3], featherAlpha);
                }
              }
            }
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="space-y-6">
      {/* Processing Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Processing Options</h3>
        
        {/* Algorithm Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Algorithm
          </label>
          <select
            value={processingOptions.algorithm}
            onChange={(e) => setProcessingOptions(prev => ({
              ...prev,
              algorithm: e.target.value as ProcessingOptions['algorithm']
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="edge-detection">Edge Detection</option>
            <option value="color-based">Color Based</option>
            <option value="ml-based">Machine Learning (Coming Soon)</option>
          </select>
        </div>
        
        {/* Threshold Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Threshold: {processingOptions.threshold.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={processingOptions.threshold}
            onChange={(e) => setProcessingOptions(prev => ({
              ...prev,
              threshold: parseFloat(e.target.value)
            }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>More Background</span>
            <span>More Subject</span>
          </div>
        </div>
        
        {/* Feathering Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feathering: {processingOptions.feathering}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={processingOptions.feathering}
            onChange={(e) => setProcessingOptions(prev => ({
              ...prev,
              feathering: parseInt(e.target.value)
            }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Sharp</span>
            <span>Soft</span>
          </div>
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={!originalImage || isProcessing}
        className={`w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white ${
          !originalImage || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Remove Background
          </>
        )}
      </button>

      {/* Processing Info */}
      {!originalImage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Please upload an image first to start processing.
          </p>
        </div>
      )}

      {/* Algorithm Descriptions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Algorithm Information:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          {processingOptions.algorithm === 'edge-detection' && (
            <p><strong>Edge Detection:</strong> Removes background by detecting edges and subject boundaries. Best for clear contrast between subject and background.</p>
          )}
          {processingOptions.algorithm === 'color-based' && (
            <p><strong>Color Based:</strong> Removes background by analyzing color similarity. Works well when the background has distinct colors.</p>
          )}
          {processingOptions.algorithm === 'ml-based' && (
            <p><strong>Machine Learning:</strong> Advanced AI-powered background removal. Coming soon for even better results.</p>
          )}
        </div>
      </div>
    </div>
  );
}