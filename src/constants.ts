/**
 * Shared constants for LightIMG application
 * These values must match the server-side configuration
 */

// Maximum file size: 100 MB
export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Allowed image types for upload
// Note: HEIC and TIFF are not supported in web version due to serverless limitations
export const ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    // 'image/heic', // Not supported in serverless
    // 'image/heif', // Not supported in serverless
    // 'image/tiff', // Not supported in serverless
    // 'image/tif',  // Not supported in serverless
];
