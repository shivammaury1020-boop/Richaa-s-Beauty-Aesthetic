import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB raw upload limit
const MAX_DATA_URL_LENGTH = 175_000; // Strictly beneath 200,000-char Firestore blueprint cap

export interface ImageUploadResult {
  url: string;
  storageMode: 'firebase-storage' | 'optimized-inline';
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please choose a JPG, PNG, or WebP image file.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Image file must be 5 MB or smaller.';
  }
  return null;
}

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.onload = () => {
        const maxDim = 960;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height / width) * maxDim);
            width = maxDim;
          } else {
            width = Math.round((width / height) * maxDim);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas compression unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.82;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > MAX_DATA_URL_LENGTH && quality > 0.35) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        if (dataUrl.length > MAX_DATA_URL_LENGTH) {
          canvas.width = Math.round(width * 0.7);
          canvas.height = Math.round(height * 0.7);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadSalonImage(
  file: File,
  folder: 'services' | 'gallery' | 'branding'
): Promise<ImageUploadResult> {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const storageRef = ref(storage, `salon/${folder}/${Date.now()}-${safeName}`);

  try {
    const uploadPromise = (async () => {
      await uploadBytes(storageRef, file, { contentType: file.type });
      return await getDownloadURL(storageRef);
    })();

    const timeoutPromise = new Promise<never>((_, reject) =>
      window.setTimeout(() => reject(new Error('storage-timeout')), 6000)
    );

    const url = await Promise.race([uploadPromise, timeoutPromise]);
    return { url, storageMode: 'firebase-storage' };
  } catch {
    // Graceful fallback when Cloud Storage bucket rules/CORS are not yet enabled:
    // compress cleanly under the Firestore blueprint size bound so upload still persists in DB.
    const dataUrl = await compressImageToDataUrl(file);
    return { url: dataUrl, storageMode: 'optimized-inline' };
  }
}
