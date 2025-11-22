/**
 * Shared constants for LightIMG application
 * These values must match the server-side configuration
 */

// Maximum file size: 100 MB
export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Allowed image types for upload
// HEIC and TIFF are converted to JPG in the browser before upload
export const ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/heic',  // Converted client-side
    'image/heif',  // Converted client-side
    'image/tiff',  // Converted client-side
    'image/tif',   // Converted client-side
];
