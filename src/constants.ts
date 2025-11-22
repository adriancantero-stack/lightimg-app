/**
 * Shared constants for LightIMG application
 * These values must match the server-side configuration
 */

// Maximum file size: 100 MB per file
// This value is also defined in server/compression-config.ts
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_FILE_SIZE_MB = 100;

// Supported image MIME types
export const ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/avif',
    'image/gif',
    'image/bmp',
    'image/x-ms-bmp',
    'image/svg+xml',
    'image/tiff',
    'image/x-tiff',
];
