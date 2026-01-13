import { useEffect, useMemo, useRef, useState } from 'react';

import { toast } from 'sonner';
import {
  deleteFiles,
  fetchFilesServices,
  uploadNewFile,
} from '@/src/lib/services/fileManagerServices';
import { getFileCategory } from '@/src/lib/utils/fileManager';
import { formattedFileItems } from '@/src/lib/utils/formatters';
import type { FormattedFileItem } from '@/src/types/fileManager';

export default function UseFileManager() {
  const [files, setFiles] = useState<FormattedFileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const getFiles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFilesServices();

      if (!data || data === null) throw new Error('Cannot possible get Files');

      const formattedData = formattedFileItems(data);
      setFiles(formattedData);
    } catch (error) {
      console.warn(error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = files.filter(
    file => getFileCategory(file.extension) === selectedType
  );

  const refetchSilent = async () => {
    try {
      const data = await fetchFilesServices();
      if (!data || data === null) throw new Error('Cannot possible get Files');
      const formattedData = formattedFileItems(data);
      setFiles(formattedData);
    } catch (error) {
      console.warn(' Error refetching files:', error);
    }
  };

  const availableTypes = useMemo(() => {
    const types = [
      ...new Set(files.map(file => getFileCategory(file.extension))),
    ];
    return types.sort();
  }, [files]);

  /**
   * Logic to Upload file
   */
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    setIsUploading(true);
    const file: File = fileList[0];
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.warning(
        `The file is very large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 5MB`
      );
      return;
    }

    try {
      await uploadNewFile(file);
      await refetchSilent();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('File Upload.');
      setUploadSuccess(true);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error al subir archivos');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMultipleFiles = async (fileKeys: string[]) => {
    setIsDeleting(true);
    try {
      const res = await deleteFiles(fileKeys);

      setSelectedFile(null);
      setSelectedFiles([]);

      if (!res.success) {
        toast.error('Error deleting files');
        return
      }

      toast.success(`${fileKeys.length} files deleted successfully`);
      await refetchSilent();
    } catch (error) {
      console.error('Error deleting files:', error);
      toast.error('Error deleting files');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFileSelection = (fileKey: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileKey)) {
        return prev.filter(key => key !== fileKey);
      } else {
        return [...prev, fileKey];
      }
    });
  };

  const selectAllFiles = () => {
    const allFilteredKeys = filteredFiles.map(file => file.key);
    setSelectedFiles(allFilteredKeys);
  };

  const clearSelection = () => {
    setSelectedFiles([]);
  };

  const resetUploadSuccess = () => setUploadSuccess(false);

  useEffect(() => {
    getFiles();
  }, []);

  useEffect(() => {
    if (availableTypes.length > 0 && !selectedType) {
      setSelectedType(availableTypes[0]);
    }
  }, [availableTypes, selectedType]);

  return {
    files,
    isLoading,
    filteredFiles,

    isUploading,
    fileInputRef,
    openFileSelector,
    handleFileUpload,

    uploadSuccess,
    resetUploadSuccess,

    selectedType,
    setSelectedType,
    selectedFile,
    setSelectedFile,

    availableTypes,

    selectedFiles,
    isDeleting,
    deleteMultipleFiles,
    toggleFileSelection,
    selectAllFiles,
    clearSelection,
  };
}
