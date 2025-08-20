import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 0.05,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export const compressImage = async (file: File): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error during image compression:', error);
    throw error;
  }
};
