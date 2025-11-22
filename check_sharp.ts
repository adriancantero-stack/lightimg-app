import sharp from 'sharp';

console.log('Sharp Versions:', sharp.versions);
console.log('HEIC Support:', sharp.format.heic);
console.log('HEIF Support:', sharp.format.heif);

try {
    // Create a dummy 1x1 pixel image to test basic functionality
    await sharp({
        create: {
            width: 1,
            height: 1,
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 0.5 }
        }
    }).toFormat('heic').toBuffer();
    console.log('HEIC encoding test passed (unexpected if decoding is missing)');
} catch (e) {
    console.log('HEIC encoding test failed:', e.message);
}
