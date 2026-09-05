import { PlusCircle } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PlusIcon } from "../../../icons";

interface DropzoneComponentProps {
  onFileChange: (file: File) => void;
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ onFileChange }) => {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      console.log("Files dropped:", acceptedFiles);
      onFileChange(acceptedFiles[0]); 
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, 
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
      "application/pdf": [],
    },
  });

  return (
    <div className="transition border w-50 border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-md hover:border-brand-500">
      <div
        {...getRootProps()}
        className={`dropzone rounded-lg border-dashed border-gray-300 p-2
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }
      `}
      >
        <input {...getInputProps()} />

        <div className="dz-message flex items-center space-x-1 m-0!">
          <div className="text-gray-500 dark:text-gray-400">
            <PlusIcon />
          </div>

          <span className="block w-full text-xs text-gray-700 dark:text-gray-400">
            Add Attachment
          </span>
        </div>
      </div>
    </div>
  );
};

export default DropzoneComponent;