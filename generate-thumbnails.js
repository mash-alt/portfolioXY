import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'src/assets/images');
const outputDir = path.join(__dirname, 'src/assets/images/thumbnails');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateThumbnails() {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    await sharp(inputPath)
      .resize({ width: 400 })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`✓ Thumbnail created: ${outputPath}`);
  }
  console.log('All thumbnails generated!');
}

generateThumbnails();
