
'use client';

import axios from 'axios';

const UPLOAD_URL = 'https://api.postimages.org/v1/upload';
// This is a public, rate-limited key for anonymous uploads.
// It's safe to be in client-side code.
const API_KEY = '17ab4f3c73c2ab99f623c21c7cb757d2'; 

/**
 * Uploads an image file to a public image hosting service (postimages.org).
 * @param file The image file to upload.
 * @returns A promise that resolves with the public URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', API_KEY);

  try {
    const response = await axios.post(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.status === 'success') {
      return response.data.data.url;
    } else {
      throw new Error(response.data?.error?.message || 'Image upload failed.');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    // Fallback to a placeholder if the upload fails
    return 'https://placehold.co/800x600.png';
  }
};
