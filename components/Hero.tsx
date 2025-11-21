import React, { useCallback } from 'react';
import { UploadCloudIcon } from './Icons';

interface HeroProps {
  onFilesSelected: (files: File[]) => void;
}

const Hero: React.FC<HeroProps> = ({ onFilesSelected }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      onFilesSelected(fileList);
      e.currentTarget.classList.remove('border-apple-blue', 'bg-blue-50');
    }
  }, [onFilesSelected]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-apple-blue', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-apple-blue', 'bg-blue-50');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      onFilesSelected(fileList);
    }
  };

  return (
    <section className="pt-32 pb-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-apple-dark mb-6 tracking-tight">
          Compress images, <br />
          <span className="text-gray-400">keep the quality.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
          Optimize your PNG, JPG, and WebP files efficiently. <br className="hidden md:block" />
          Smart compression that reduces file size, not visual fidelity.
        </p>

        <div 
          className="group relative w-full max-w-2xl mx-auto bg-white rounded-3xl border-2 border-dashed border-gray-200 transition-all duration-300 hover:border-apple-blue hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input 
            type="file" 
            id="fileInput" 
            className="hidden" 
            multiple 
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileInput}
          />
          
          <div className="py-16 px-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-50">
              <UploadCloudIcon className="w-10 h-10 text-apple-blue" />
            </div>
            <h3 className="text-xl font-semibold text-apple-dark mb-2">
              Drop your images here
            </h3>
            <p className="text-gray-400 text-sm">
              or click to browse files (up to 10MB each)
            </p>
          </div>
        </div>
        
        <p className="mt-6 text-xs text-gray-400 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
          Secure processing. Files are automatically deleted after processing.
        </p>
      </div>
    </section>
  );
};

export default Hero;