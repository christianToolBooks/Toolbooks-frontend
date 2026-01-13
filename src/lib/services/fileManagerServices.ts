import { FileManagerResponse } from '@/src/types/fileManager';
import apiClient from '../axios';
import { ResponseApiInterface } from '@/src/types/apiResponse';

/**
 * GET / Get all files
 */
export const fetchFilesServices = async (): Promise<
  FileManagerResponse[] | null
> => {
  try {
    const res = await apiClient.get('file');
    return res.data;
  } catch (error) {
    console.warn(error);
    return null;
  }
};

/**
 * POST /  Upload a new file
 */
export const uploadNewFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

   const res = await apiClient.post('file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
const url = res.data?.url; 
    if (!url) throw new Error('No URL returned from upload');
    return url; // Devuelve la URL del archivo subido
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

/**
 * DELETE / Delete one or more files
 */
export const deleteFiles = async (
  data: string[]
): Promise<ResponseApiInterface> => {
  try {

    await apiClient.post('file/delete', data);
    return {
      success: true,
      message: 'Files deleted succesfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Cannot possible deleted Files',
    };
  }
};
