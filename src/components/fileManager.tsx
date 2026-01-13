'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Trash2, Upload, X } from 'lucide-react';

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import {
  getFileCategory,
  getCategoryDisplayName,
  getCategoryIcon,
} from '@/src/lib/utils/fileManager';
import UseFileManager from '@/src/hooks/useFileManager';
import { ModalLoader } from './fileManagerLoader';
import Image from 'next/image';

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect?: (fileUrl: string, fileKey: string) => void;
}

const FilesManager = ({ isOpen, onClose, onFileSelect }: FileModalProps) => {
  const {
    files,
    isLoading,
    filteredFiles,

    isUploading,
    fileInputRef,
    handleFileUpload,
    openFileSelector,

    resetUploadSuccess,
    uploadSuccess,

    selectedType,
    setSelectedType,
    selectedFile,
    setSelectedFile,
    selectAllFiles,
    selectedFiles,
    clearSelection,
    toggleFileSelection,

    isDeleting,
    deleteMultipleFiles,

    availableTypes,
  } = UseFileManager();

  // Reset when the type changed
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedFile(null);
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.length > 0) {
      deleteMultipleFiles(selectedFiles);
    }
  };

  const isFileSelected = (fileKey: string) => selectedFiles.includes(fileKey);

  const handleUseFile = () => {
    if (selectedFile && onFileSelect) {
      const file = files.find(f => f.key === selectedFile);
      if (file) {
        onFileSelect(file.url, file.key);
      }
    }
    onClose();
  };

  useEffect(() => {
    if (uploadSuccess) {
      resetUploadSuccess();
    }
  }, [uploadSuccess, onClose, resetUploadSuccess]);

  return (
    <Transition show={isOpen} as={Fragment}>
      {isLoading ? (
        <ModalLoader />
      ) : (
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Header */}
                  <div className="flex justify-between items-start p-6 pb-4">
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900">
                        File Manager
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 mt-1">
                        Your uploaded Files.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="px-6 pb-4">
                    <div className="flex gap-2 flex-wrap">
                      {availableTypes.map(type => {
                        const Icon = getCategoryIcon(type);
                        const count = files.filter(
                          f => getFileCategory(f.extension) === type
                        ).length;
                        const displayName = getCategoryDisplayName(type);

                        return (
                          <Button
                            key={type}
                            variant={
                              selectedType === type ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => handleTypeChange(type)}
                            className="rounded-md flex items-center gap-2"
                          >
                            <Icon className="w-4 h-4" />
                            {displayName}
                            <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                              {count}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div className="px-6">
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-4">
                        <div
                          className="grid grid-cols-6 gap-4 max-h-80 overflow-y-auto pr-2"
                          style={{ scrollbarWidth: 'thin' }}
                        >
                          {filteredFiles.map(file => {
                            const category = getFileCategory(file.extension);
                            const Icon = getCategoryIcon(category);
                            const isSelected = isFileSelected(file.key);

                            return (
                              <div
                                key={file.key}
                                className={`
                relative bg-gray-50 rounded-lg p-3 cursor-pointer transition-all
                hover:bg-gray-100 border-2 group
                ${selectedFile === file.key ? 'border-blue-500 bg-blue-50' : ''}
                ${isSelected ? 'border-green-500 bg-green-50' : ''}
              `}
                                onClick={() => setSelectedFile(file.key)}
                              >
                                {/* Selection checkbox */}
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleFileSelection(file.key)}
                                  onClick={e => e.stopPropagation()}
                                  className="absolute top-2 left-2 z-10 w-4 h-4 accent-green-600"
                                />

                                {/* File Preview */}
                                <div className="aspect-square mb-2 flex items-center justify-center">
                                  {category === 'image' ||
                                  category === 'svg' ? (
                                    <Image
                                      src={file.url || '/placeholder.svg'}
                                      alt={file.name}
                                      className="w-full h-full object-cover rounded-md"
                                      width={300}
                                      height={300}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-500 h-full">
                                      <Icon className="w-12 h-12 mb-2" />
                                    </div>
                                  )}
                                </div>

                                {/* File Info */}
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span className="uppercase font-mono">
                                      {file.extension}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {filteredFiles.length === 0 && (
                          <div className="flex items-center justify-center h-40 text-gray-500">
                            <div className="text-center">
                              {(() => {
                                const Icon = getCategoryIcon(selectedType);
                                return (
                                  <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                );
                              })()}
                              <p>Not found</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bottom Actions */}
                  <div className="px-6 py-4">
                    <hr className="border-gray-200 mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {filteredFiles.length}{' '}
                        {getCategoryDisplayName(selectedType).toLowerCase()} •{' '}
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} selected for bulk action`
                          : selectedFile
                            ? '1 selected for use'
                            : 'None selected'}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="rounded-md"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline"
                          onClick={selectAllFiles}
                          disabled={filteredFiles.length === 0}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearSelection}
                          disabled={selectedFiles.length === 0}
                        >
                          Clear Selection
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteSelected}
                          disabled={selectedFiles.length === 0 || isDeleting}
                        >
                          {isDeleting
                            ? 'Deleting...'
                            : `Delete Selected (${selectedFiles.length})`}
                        </Button>
                        <Button
                          onClick={openFileSelector}
                          disabled={isUploading}
                          className="rounded-md"
                        >
                          {isUploading ? 'Uploading...' : 'Upload a new File'}
                        </Button>
                        <Button
                          onClick={handleUseFile}
                          disabled={
                            !selectedFile ||
                            selectedFiles.length > 0 ||
                            isDeleting
                          }
                          className="rounded-md"
                        >
                          Use File
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      )}
    </Transition>
  );
};

export default FilesManager;
