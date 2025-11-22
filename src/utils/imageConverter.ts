/**
 * Client-side image conversion utilities
 * Converts HEIC and TIFF to JPG in the browser before uploading
 */

import heic2any from 'heic2any';
import UTIF from 'utif';

/**
 * Convert HEIC/HEIF to JPG
 */
export async function convertHEICToJPG(file: File): Promise<File> {
    try {
        console.log(`[Converter] Converting HEIC: ${file.name}, size: ${file.size}`);

        // heic2any can be picky, try with different options
        let convertedBlob;

        try {
            // Try with default settings first
            convertedBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.95,
            });
        } catch (firstError) {
            console.warn('[Converter] First attempt failed, trying with PNG:', firstError);

            // Fallback: try converting to PNG first, then to JPEG
            try {
                const pngBlob = await heic2any({
                    blob: file,
                    toType: 'image/png',
                });

                // Convert PNG to JPEG using canvas
                const pngBlobSingle = Array.isArray(pngBlob) ? pngBlob[0] : pngBlob;
                convertedBlob = await convertBlobToJPEG(pngBlobSingle);
            } catch (secondError) {
                console.error('[Converter] Second attempt also failed:', secondError);
                throw new Error('HEIC conversion failed. This file may be corrupted or use an unsupported HEIC variant.');
            }
        }

        // heic2any can return Blob or Blob[]
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

        // Create new File with JPG extension
        const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
        const convertedFile = new File([blob], newFileName, { type: 'image/jpeg' });

        console.log(`[Converter] HEIC converted successfully: ${file.size} → ${convertedFile.size} bytes`);
        return convertedFile;
    } catch (error) {
        console.error('[Converter] HEIC conversion failed:', error);
        throw new Error(`Failed to convert HEIC file. ${error instanceof Error ? error.message : 'Please try a different file or convert to JPG first.'}`);
    }
}

/**
 * Helper: Convert any blob to JPEG using canvas
 */
async function convertBlobToJPEG(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            canvas.toBlob(
                (jpegBlob) => {
                    if (jpegBlob) {
                        resolve(jpegBlob);
                    } else {
                        reject(new Error('Failed to convert to JPEG'));
                    }
                },
                'image/jpeg',
                0.95
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/**
 * Convert TIFF to JPG
 */
export async function convertTIFFToJPG(file: File): Promise<File> {
    try {
        console.log(`[Converter] Converting TIFF: ${file.name}`);

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Decode TIFF
        const ifds = UTIF.decode(arrayBuffer);
        const firstImage = ifds[0];
        UTIF.decodeImage(arrayBuffer, firstImage);

        // Convert to RGBA
        const rgba = UTIF.toRGBA8(firstImage);

        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = firstImage.width;
        canvas.height = firstImage.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }

        // Create ImageData and put on canvas
        const imageData = new ImageData(
            new Uint8ClampedArray(rgba),
            firstImage.width,
            firstImage.height
        );
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to Blob
        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to convert canvas to blob'));
                },
                'image/jpeg',
                0.95 // High quality for conversion
            );
        });

        // Create new File with JPG extension
        const newFileName = file.name.replace(/\.(tiff?|tif)$/i, '.jpg');
        const convertedFile = new File([blob], newFileName, { type: 'image/jpeg' });

        console.log(`[Converter] TIFF converted: ${file.size} → ${convertedFile.size} bytes`);
        return convertedFile;
    } catch (error) {
        console.error('[Converter] TIFF conversion failed:', error);
        throw new Error(`Failed to convert TIFF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Check if file needs conversion and convert if needed
 */
export async function convertIfNeeded(file: File): Promise<File> {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type = file.type.toLowerCase();

    // Check if HEIC/HEIF
    if (type === 'image/heic' || type === 'image/heif' || ext === 'heic' || ext === 'heif') {
        return await convertHEICToJPG(file);
    }

    // Check if TIFF
    if (type === 'image/tiff' || type === 'image/tif' || ext === 'tiff' || ext === 'tif') {
        return await convertTIFFToJPG(file);
    }

    // No conversion needed
    return file;
}

/**
 * Check if file needs conversion
 */
export function needsConversion(file: File): boolean {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type = file.type.toLowerCase();

    return (
        type === 'image/heic' ||
        type === 'image/heif' ||
        type === 'image/tiff' ||
        type === 'image/tif' ||
        ext === 'heic' ||
        ext === 'heif' ||
        ext === 'tiff' ||
        ext === 'tif'
    );
}
