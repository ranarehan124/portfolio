import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import { CLOUDINARY } from '../config/index.js';

cloudinary.v2.config({
  cloud_name: CLOUDINARY.cloudName,
  api_key: CLOUDINARY.apiKey,
  api_secret: CLOUDINARY.apiSecret,
  secure: true,
});

interface UploadResult {
  url: string;
  publicId: string;
}

function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: `${CLOUDINARY.folder}/${folder}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function uploadImage(
  fileBuffer: Buffer,
): Promise<UploadResult> {
  return uploadBufferToCloudinary(fileBuffer, 'images');
}

export async function uploadMultipleImages(
  files: Buffer[],
): Promise<UploadResult[]> {
  return Promise.all(
    files.map((buffer) => uploadBufferToCloudinary(buffer, 'images')),
  );
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.v2.uploader.destroy(publicId);
}

export { cloudinary };