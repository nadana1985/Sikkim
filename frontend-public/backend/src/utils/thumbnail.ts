import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// ─── Thumbnail Configuration ─────────────────────────────────────────────────

const THUMBNAIL_DIR = path.join(__dirname, '..', '..', 'data', 'images', 'thumbnails');
const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 300;
const THUMBNAIL_QUALITY = 80;

// Ensure thumbnail directory exists
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

// ─── Thumbnail Generation ────────────────────────────────────────────────────

/**
 * Generate a thumbnail for an image file
 * @param inputPath - Full path to the original image
 * @param filename - Original filename (used to generate thumbnail name)
 * @returns Promise<string> - Path to the thumbnail relative to images directory
 */
export async function generateThumbnail(
  inputPath: string,
  filename: string
): Promise<string | null> {
  try {
    // Check if file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Input file not found: ${inputPath}`);
      return null;
    }

    // Generate thumbnail filename
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const thumbnailFilename = `${nameWithoutExt}_thumb${ext}`;
    const thumbnailPath = path.join(THUMBNAIL_DIR, thumbnailFilename);

    // Generate thumbnail with sharp
    await sharp(inputPath)
      .resize({
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
      })
      .jpeg({ quality: THUMBNAIL_QUALITY, progressive: true })
      .toFile(thumbnailPath);

    // Return relative path for API response
    return `/images/thumbnails/${thumbnailFilename}`;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}

/**
 * Check if a file is an image that can be thumbnailed
 * @param mimetype - File MIME type
 * @returns boolean
 */
export function canGenerateThumbnail(mimetype: string): boolean {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimetype);
}

/**
 * Get thumbnail path for a given image path
 * @param imagePath - Original image path (e.g., /images/123456.jpg)
 * @returns Thumbnail path (e.g., /images/thumbnails/123456_thumb.jpg)
 */
export function getThumbnailPath(imagePath: string): string {
  const ext = path.extname(imagePath);
  const nameWithoutExt = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);
  return `${dir}/thumbnails/${nameWithoutExt}_thumb${ext}`;
}
