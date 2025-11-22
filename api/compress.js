const multer = require('multer');
const {
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
} = require('../server/compression-config');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// Helper to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

module.exports = async function handler(req, res) {
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

        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        console.log(`[API] Processing file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);

        const originalBuffer = file.buffer;
        let mimetype = file.mimetype;
        let originalName = file.originalname;
        let processedBuffer;

        // Get file extension
        const ext = originalName.split('.').pop()?.toLowerCase();

        // HEIC/HEIF and TIFF are not supported in serverless environment
        if (mimetype === 'image/heic' || mimetype === 'image/heif' || ext === 'heic' || ext === 'heif') {
            res.status(400).json({
                error: 'HEIC format not supported in web version',
                message: 'HEIC files require native libraries not available in serverless environment. Please convert to JPG/PNG first.'
            });
            return;
        }

        if (ext === 'tiff' || ext === 'tif') {
            res.status(400).json({
                error: 'TIFF format not supported in web version',
                message: 'TIFF files require native libraries not available in serverless environment. Please convert to JPG/PNG first.'
            });
            return;
        }

        // Process supported formats
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
            default:
                throw new Error(`Unsupported file format: ${ext}`);
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

    } catch (err) {
        console.error('[API] Error processing image:', err);
        if (err && err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({ error: 'File too large' });
            return;
        }
        res.status(500).json({
            error: 'Image processing failed',
            message: err.message || 'Unknown error'
        });
    }
};

// Disable body parsing, multer will handle it
module.exports.config = {
    api: {
        bodyParser: false,
    },
};
