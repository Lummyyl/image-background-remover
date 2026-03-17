export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  downloadUrl: string;
  filename: string;
  size: number;
  format: string;
  processingTime: number;
  algorithm: string;
}

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  error?: string;
}

export interface ProcessResult {
  success: boolean;
  url: string;
  downloadUrl: string;
  processingTime: number;
  error?: string;
}

export interface ProcessingOptions {
  algorithm: 'edge-detection' | 'color-based' | 'ml-based';
  threshold: number;
  feathering: number;
  background?: string;
}

export interface FileWithPreview {
  file: File;
  preview: string;
  name: string;
  size: number;
}