// Status of file processing
export type FileStatus = 'converting' | 'ready' | 'processing' | 'done' | 'error';

export interface CompressedFile {
  id: string;
  originalFile: File;
  status: FileStatus;
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  downloadUrl?: string;
  error?: string;
  progress?: number; // 0-100
}

export interface ProcessingResponse {
  success: boolean;
  data?: {
    size: number;
    type: string;
    data: string; // base64
  };
  error?: string;
}
