import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'public', 'filthi-link-logo.png');
const appDir = path.join(process.cwd(), 'app');
const faviconIoDir = path.join(process.cwd(), 'public', 'favicon_io');

async function generate() {
  if (!fs.existsSync(src)) {
    console.error('Source logo not found:', src);
    process.exit(1);
  }

  // 1. Generate Next.js App Router icons
  await sharp(src)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(appDir, 'icon.png'));

  await sharp(src)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(appDir, 'apple-icon.png'));

  // Remove standard favicon.ico if it exists, since we use icon.png
  const faviconIcoPath = path.join(appDir, 'favicon.ico');
  if (fs.existsSync(faviconIcoPath)) {
    fs.unlinkSync(faviconIcoPath);
  }

  // 2. Generate favicon_io files
  if (fs.existsSync(faviconIoDir)) {
    await sharp(src).resize(192, 192).toFile(path.join(faviconIoDir, 'android-chrome-192x192.png'));
    await sharp(src).resize(512, 512).toFile(path.join(faviconIoDir, 'android-chrome-512x512.png'));
    await sharp(src).resize(180, 180).toFile(path.join(faviconIoDir, 'apple-touch-icon.png'));
    await sharp(src).resize(16, 16).toFile(path.join(faviconIoDir, 'favicon-16x16.png'));
    await sharp(src).resize(32, 32).toFile(path.join(faviconIoDir, 'favicon-32x32.png'));
    // We can't generate .ico easily with sharp directly without another module, 
    // but typically next.js doesn't need public/favicon_io/favicon.ico anymore,
    // so we'll just leave or delete it. Let's try creating a 32x32 png and rename to .ico as a quick hack
    // some browsers accept png disguised as ico.
    await sharp(src).resize(32, 32).toFile(path.join(faviconIoDir, 'favicon.ico'));
  }

  console.log('Favicons generated successfully.');
}

generate().catch(console.error);
