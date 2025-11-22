/**
 * Centralized compression configuration for LightIMG
 * 
 * This module defines compression strategies and quality settings for all supported image formats.
 * Quality values are chosen to balance visual fidelity with file size reduction.
 */

import sharp from 'sharp';
import { optimize } from 'svgo';
import heicConvert from 'heic-convert';
import { Buffer } from 'buffer';

// Maximum file size: 100 MB per file
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/**
 * Compression configuration per format
 * 
 * Quality rationale:
 * - JPEG (80): Balance between quality and size; visually high quality, significant reduction
 * - PNG (compressionLevel 9): Maximum compression with palette optimization
 * - WebP (75): Visually lossless in most cases
 * - AVIF (55): AVIF compresses better by design, 55 is sufficient for excellent quality
 * - GIF (128 colors): Preserves animation while reducing file size
 * - HEIC/BMP/TIFF → JPEG (80): Converted to JPEG for maximum compatibility
 */
export const COMPRESSION_CONFIG = {
    jpeg: {
        quality: 80,
        mozjpeg: true, // Use MozJPEG for better compression
    },
    png: {
        compressionLevel: 9, // Maximum compression (0-9)
        palette: true, // Enable palette-based optimization
    },
    webp: {
        quality: 75,
    },
    avif: {
        quality: 55,
    },
    gif: {
        colors: 128, // Reduce color palette while preserving animation
    },
    svg: {
        multipass: true,
        plugins: ['preset-default'], // Minify, remove metadata, clean up
    },
};

/**
 * Compress JPEG/JPG images
 */
export async function compressJPEG(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .jpeg(COMPRESSION_CONFIG.jpeg)
        .toBuffer();
}

/**
 * Compress PNG images
 */
export async function compressPNG(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .png(COMPRESSION_CONFIG.png)
        .toBuffer();
}

/**
 * Compress WebP images
 */
export async function compressWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .webp(COMPRESSION_CONFIG.webp)
        .toBuffer();
}

/**
 * Compress AVIF images
 */
export async function compressAVIF(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .avif(COMPRESSION_CONFIG.avif)
        .toBuffer();
}

/**
 * Compress GIF images (preserves animation)
 */
export async function compressGIF(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer, { animated: true })
        .gif(COMPRESSION_CONFIG.gif)
        .toBuffer();
}

/**
 * Optimize SVG images
 */
export function optimizeSVG(buffer: Buffer): Buffer {
    const svgString = buffer.toString('utf8');
    const result = optimize(svgString, {
        multipass: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugins: ['preset-default' as any], // svgo type issue with string plugins
    });
    return Buffer.from(result.data);
}

/**
 * Convert HEIC/HEIF to JPEG and compress
 * HEIC is converted to JPEG for maximum compatibility across browsers and devices
 */
export async function convertAndCompressHEIC(buffer: Buffer): Promise<Buffer> {
    // Step 1: Convert HEIC to JPEG using heic-convert (pure JS/WASM)
    const jpegBuffer = await heicConvert({
        buffer: buffer,
        format: 'JPEG',
        quality: 1, // Maximum quality for conversion, we'll compress next
    });

    // Step 2: Compress the converted JPEG
    return compressJPEG(Buffer.from(jpegBuffer));
}

/**
 * Convert BMP to JPEG and compress
 * BMP is converted to JPEG for better compression and compatibility
 */
export async function convertAndCompressBMP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .jpeg(COMPRESSION_CONFIG.jpeg)
        .toBuffer();
}

/**
 * Convert TIFF to JPEG and compress
 * TIFF is converted to JPEG for better compression and compatibility
 */
export async function convertAndCompressTIFF(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .jpeg(COMPRESSION_CONFIG.jpeg)
        .toBuffer();
}
