import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
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
} from './compression-config';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for memory storage (images processing in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|heic|heif|avif|gif|bmp|svg|tiff|tif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'image/x-ms-bmp' || file.mimetype === 'image/svg+xml' || file.mimetype === 'image/x-tiff';

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (png, jpg, webp, heic, heif, avif, gif, bmp, svg, tiff) are allowed'));
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Light IMG API is running');
});

// Compression Endpoint
app.post('/api/compress', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const originalBuffer = req.file.buffer;
    let mimetype = req.file.mimetype;
    let originalName = req.file.originalname;
    let processedBuffer: Buffer;

    // HEIC/HEIF: Convert to JPEG for maximum compatibility
    if (mimetype === 'image/heic' || mimetype === 'image/heif') {
      console.log(`[HEIC] Processing HEIC file: ${req.file.originalname}`);

      try {
        processedBuffer = await convertAndCompressHEIC(originalBuffer);
        console.log('[HEIC] Conversion and compression success.');

        // Update metadata for response
        mimetype = 'image/jpeg';
        originalName = originalName.replace(/\.(heic|heif)$/i, '.jpg');
      } catch (heicError: unknown) {
        console.error('[HEIC] Conversion failed:', heicError);
        throw new Error(`HEIC conversion failed: ${heicError instanceof Error ? heicError.message : 'Unknown error'}`);
      }
    } else {
      // Process other formats using centralized compression functions
      if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
        processedBuffer = await compressJPEG(originalBuffer);
      } else if (mimetype === 'image/png') {
        processedBuffer = await compressPNG(originalBuffer);
      } else if (mimetype === 'image/webp') {
        processedBuffer = await compressWebP(originalBuffer);
      } else if (mimetype === 'image/avif') {
        processedBuffer = await compressAVIF(originalBuffer);
      } else if (mimetype === 'image/gif') {
        processedBuffer = await compressGIF(originalBuffer);
      } else if (mimetype === 'image/bmp' || mimetype === 'image/x-ms-bmp') {
        // BMP: Convert to JPEG for better compression and compatibility
        processedBuffer = await convertAndCompressBMP(originalBuffer);
        mimetype = 'image/jpeg';
        originalName = originalName.replace(/\.bmp$/i, '.jpg');
      } else if (mimetype === 'image/tiff' || mimetype === 'image/x-tiff') {
        // TIFF: Convert to JPEG for better compression and compatibility
        processedBuffer = await convertAndCompressTIFF(originalBuffer);
        mimetype = 'image/jpeg';
        originalName = originalName.replace(/\.(tiff|tif)$/i, '.jpg');
      } else if (mimetype === 'image/svg+xml') {
        processedBuffer = optimizeSVG(originalBuffer);
      } else {
        processedBuffer = originalBuffer;
      }

      // Safety check: If compression resulted in a larger file, return the original
      // (Only applies to same-format compression, not format conversions)
      if (processedBuffer.length >= originalBuffer.length) {
        console.log(`Skipping compression for ${req.file.originalname}: Result was larger.`);
        processedBuffer = originalBuffer;
      }
    }

    console.log(`Processed ${req.file.originalname}: ${(originalBuffer.length / 1024).toFixed(2)}KB -> ${(processedBuffer.length / 1024).toFixed(2)}KB`);

    // Return the image directly
    res.set('Content-Type', mimetype);
    res.set('Content-Disposition', `attachment; filename="lightimg_${originalName}"`);
    res.set('X-Original-Format', req.file.mimetype); // Send original format header for frontend info
    res.send(processedBuffer);

  } catch (err: unknown) {
    console.error('Error processing image:', err);
    if (err && typeof err === 'object' && 'code' in err && err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'File too large' });
      return;
    }
    res.status(500).json({ error: 'Image processing failed' });
  }
});

app.listen(port, () => {
  console.log(`Light IMG Server running at http://localhost:${port}`);
});