
import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { UI_TEXT } from '../../constants';

interface FileUploadProps {
  id: string;
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string; 
  containerClassName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ id, label, onFileSelect, accept, containerClassName = "mb-4" }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleContainerClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };
  
  return (
    <div className={containerClassName}>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <div
        className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors ${selectedFile ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-750'}`}
        onClick={handleContainerClick}
        onDragOver={(e) => e.preventDefault()} 
        onDrop={(e) => { 
          e.preventDefault();
          const file = e.dataTransfer.files?.[0] || null;
          setSelectedFile(file);
          onFileSelect(file);
        }}
      >
        <input
          id={id}
          name={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          ref={fileInputRef}
          className="sr-only"
        />
        {selectedFile ? (
          <div className="text-center w-full">
            <FileIcon className="mx-auto h-10 w-10 text-indigo-400" />
            <p className="mt-1 text-sm text-slate-300 truncate">{selectedFile.name}</p>
            <p className="text-xs text-slate-400">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                handleRemoveFile();
              }}
              className="mt-2 text-xs text-red-400 hover:text-red-300 font-medium inline-flex items-center"
            >
              <X size={14} className="mr-1" /> Quitar archivo
            </button>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
            <div className="flex text-sm text-slate-400">
              <span className="relative font-medium text-indigo-400 hover:text-indigo-300">
                <span>Subir un archivo</span>
              </span>
              <p className="pl-1">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-slate-500">
              {accept ? `Tipos aceptados: ${accept}` : UI_TEXT.noFileSelected}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};