
/**
 * Uploads an image file to a public image hosting service (imgbb.com).
 * @param file The image file to upload.
 * @returns A promise that resolves with the public URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
  const apiKey = 'b45015202a3a0446afb5f500582230a1';
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();

    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error?.message || 'Image upload failed.');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Image upload failed. Please try again.');
  }
};
