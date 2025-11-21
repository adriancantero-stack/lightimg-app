import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import path from 'path';
import { Buffer } from 'buffer';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for memory storage (images processing in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (png, jpg, webp) are allowed'));
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
    const mimetype = req.file.mimetype;
    let processedBuffer: Buffer;

    // Compression logic using Sharp
    // Quality 60 is a good balance for "TinyPNG-like" results
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
    } else {
      processedBuffer = originalBuffer;
    }

    // Safety check: If compression resulted in a larger file, return the original
    if (processedBuffer.length >= originalBuffer.length) {
      console.log(`Skipping compression for ${req.file.originalname}: Result was larger.`);
      processedBuffer = originalBuffer;
    } else {
      console.log(`Compressed ${req.file.originalname}: ${(originalBuffer.length / 1024).toFixed(2)}KB -> ${(processedBuffer.length / 1024).toFixed(2)}KB`);
    }

    // Return the image directly
    res.set('Content-Type', mimetype);
    res.send(processedBuffer);

  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ error: 'Image compression failed.' });
  }
});

app.listen(port, () => {
  console.log(`Light IMG Server running at http://localhost:${port}`);
});