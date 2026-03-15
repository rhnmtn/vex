import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

/**
 * Cloudinary URL'ine delivery optimizasyonu ekler (genişlik, kalite, format).
 * Hero için: yüksek çözünürlük, en iyi kalite.
 */
export function getOptimizedImageUrl(
  url: string,
  options?: { width?: number; quality?: string }
): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/'))
    return url;
  if (url.includes('/w_') || url.includes(',c_scale,')) return url;
  const width = options?.width ?? 2560;
  const quality = options?.quality ?? 'auto:best';
  const transform = `w_${width},c_scale,q_${quality},f_auto`;
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  path: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    filename: string;
    mimeType: string;
    folder?: string;
    alt?: string;
  }
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary yapılandırılmamış. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET ortam değişkenlerini ayarlayın.'
    );
  }

  const folder = options.folder ?? 'media';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        overwrite: false,
        resource_type: 'auto'
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result) {
          reject(new Error('Cloudinary yanıt döndürmedi'));
          return;
        }
        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url ?? '',
          path: result.secure_url ?? '',
          width: result.width,
          height: result.height,
          format: result.format ?? options.mimeType.split('/')[1] ?? 'unknown',
          bytes: result.bytes ?? 0
        });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  options?: { resourceType?: 'image' | 'video' | 'raw' }
): Promise<void> {
  if (!isCloudinaryConfigured) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: options?.resourceType ?? 'image'
  });
}
