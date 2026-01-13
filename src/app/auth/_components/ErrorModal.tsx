import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  title?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen, 
  onClose, 
  error, 
  title = "Registration Error" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Error Message */}
          <div className="mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              {error}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;