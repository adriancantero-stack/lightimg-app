import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import path from 'path';
import { Buffer } from 'buffer';
import heicConvert from 'heic-convert';
import { optimize } from 'svgo';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for memory storage (images processing in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
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
    let isHeic = false;

    // Handle HEIC/HEIF
    if (mimetype === 'image/heic' || mimetype === 'image/heif') {
      isHeic = true;
      console.log(`[HEIC-DEBUG] Processing HEIC file: ${req.file.originalname}`);

      try {
        // Convert to JPEG using heic-convert (pure JS/WASM)
        console.log('[HEIC-DEBUG] Starting heic-convert...');
        const jpegBuffer = await heicConvert({
          buffer: originalBuffer,
          format: 'JPEG',
          quality: 1
        });
        console.log('[HEIC-DEBUG] heic-convert success. Buffer size:', Buffer.byteLength(jpegBuffer));

        // Pass the converted JPEG to Sharp for standard optimization
        console.log('[HEIC-DEBUG] Starting sharp optimization...');
        processedBuffer = await sharp(jpegBuffer)
          .jpeg({ quality: 60, mozjpeg: true })
          .toBuffer();
        console.log('[HEIC-DEBUG] Sharp optimization success.');

        // Update metadata for response
        mimetype = 'image/jpeg';
        // Replace extension with .jpg
        originalName = originalName.replace(/\.(heic|heif)$/i, '.jpg');
      } catch (heicError: any) {
        console.error('[HEIC-DEBUG] Conversion failed:', heicError);
        throw new Error(`HEIC conversion failed: ${heicError.message}`);
      }
    } else {
      // Existing logic for other formats
      if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
        processedBuffer = await sharp(originalBuffer)
          .jpeg({ quality: 60, mozjpeg: true })
          .toBuffer();
      } else if (mimetype === 'image/png') {
        processedBuffer = await sharp(originalBuffer)
          .png({ quality: 60, compressionLevel: 8, palette: true })
          .toBuffer();
      } else if (mimetype === 'image/webp') {
        processedBuffer = await sharp(originalBuffer)
          .webp({ quality: 60 })
          .toBuffer();
      } else if (mimetype === 'image/avif') {
        processedBuffer = await sharp(originalBuffer)
          .avif({ quality: 50 })
          .toBuffer();
      } else if (mimetype === 'image/gif') {
        processedBuffer = await sharp(originalBuffer, { animated: true })
          .gif({ colors: 128 })
          .toBuffer();
      } else if (mimetype === 'image/bmp' || mimetype === 'image/x-ms-bmp') {
        processedBuffer = await sharp(originalBuffer)
          .jpeg({ quality: 60, mozjpeg: true })
          .toBuffer();

        // Update metadata for response
        mimetype = 'image/jpeg';
        originalName = originalName.replace(/\.bmp$/i, '.jpg');
      } else if (mimetype === 'image/tiff' || mimetype === 'image/x-tiff') {
        processedBuffer = await sharp(originalBuffer)
          .jpeg({ quality: 60, mozjpeg: true })
          .toBuffer();

        // Update metadata for response
        mimetype = 'image/jpeg';
        originalName = originalName.replace(/\.(tiff|tif)$/i, '.jpg');
      } else if (mimetype === 'image/svg+xml') {
        const svgString = originalBuffer.toString('utf8');
        const result = optimize(svgString, {
          multipass: true,
          plugins: [
            'preset-default',
          ],
        });
        processedBuffer = Buffer.from(result.data);
      } else {
        processedBuffer = originalBuffer;
      }

      // Safety check: If compression resulted in a larger file, return the original
      // ONLY if it's not a format conversion (like HEIC -> JPG)
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

  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

app.listen(port, () => {
  console.log(`Light IMG Server running at http://localhost:${port}`);
});