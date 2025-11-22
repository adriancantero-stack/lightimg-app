import type { VercelRequest, VercelResponse } from '@vercel/node';
import multer from 'multer';
import { Buffer } from 'buffer';
import {
    MAX_FILE_SIZE_BYTES,
    compressJPEG,
    compressPNG,
    compressWebP,
    compressAVIF,
    compressGIF,
    optimizeSVG,
    convertAndCompressHEIC,
    convertAndCompressBMP,
    convertAndCompressTIFF,
} from '../server/compression-config';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// Helper to run middleware
function runMiddleware(req: any, res: any, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        // Run multer middleware
        await runMiddleware(req, res, upload.single('file'));

        const file = (req as any).file;
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        console.log(`[API] Processing file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);

        const originalBuffer = file.buffer;
        let mimetype = file.mimetype;
        let originalName = file.originalname;
        let processedBuffer: Buffer;

        // HEIC/HEIF: Convert to JPEG
        if (mimetype === 'image/heic' || mimetype === 'image/heif') {
            console.log(`[HEIC] Processing HEIC file: ${file.originalname}`);
            try {
                processedBuffer = await convertAndCompressHEIC(originalBuffer);
                mimetype = 'image/jpeg';
                originalName = originalName.replace(/\.(heic|heif)$/i, '.jpg');
            } catch (heicError: unknown) {
                console.error('[HEIC] Conversion failed:', heicError);
                throw new Error(`HEIC conversion failed: ${heicError instanceof Error ? heicError.message : 'Unknown error'}`);
            }
        } else {
            // Process other formats
            const ext = originalName.split('.').pop()?.toLowerCase();

            switch (ext) {
                case 'jpg':
                case 'jpeg':
                    processedBuffer = await compressJPEG(originalBuffer);
                    break;
                case 'png':
                    processedBuffer = await compressPNG(originalBuffer);
                    break;
                case 'webp':
                    processedBuffer = await compressWebP(originalBuffer);
                    break;
                case 'avif':
                    processedBuffer = await compressAVIF(originalBuffer);
                    break;
                case 'gif':
                    processedBuffer = await compressGIF(originalBuffer);
                    break;
                case 'svg':
                    processedBuffer = optimizeSVG(originalBuffer);
                    break;
                case 'bmp':
                    processedBuffer = await convertAndCompressBMP(originalBuffer);
                    mimetype = 'image/jpeg';
                    originalName = originalName.replace(/\.bmp$/i, '.jpg');
                    break;
                case 'tiff':
                case 'tif':
                    processedBuffer = await convertAndCompressTIFF(originalBuffer);
                    mimetype = 'image/jpeg';
                    originalName = originalName.replace(/\.tiff?$/i, '.jpg');
                    break;
                default:
                    throw new Error(`Unsupported file format: ${ext}`);
            }
        }

        const originalSize = originalBuffer.length;
        const compressedSize = processedBuffer.length;
        const reduction = ((originalSize - compressedSize) / originalSize) * 100;

        console.log(`[API] Compression complete: ${originalSize} → ${compressedSize} bytes (${reduction.toFixed(1)}% reduction)`);

        // Send response
        res.setHeader('Content-Type', mimetype);
        res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
        res.setHeader('X-Original-Size', originalSize.toString());
        res.setHeader('X-Compressed-Size', compressedSize.toString());
        res.setHeader('X-Original-Format', file.mimetype);
        res.send(processedBuffer);

    } catch (err: unknown) {
        console.error('[API] Error processing image:', err);
        if (err && typeof err === 'object' && 'code' in err && err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({ error: 'File too large' });
            return;
        }
        res.status(500).json({
            error: 'Image processing failed',
            message: err instanceof Error ? err.message : 'Unknown error'
        });
    }
}

// Disable body parsing, multer will handle it
export const config = {
    api: {
        bodyParser: false,
    },
};
