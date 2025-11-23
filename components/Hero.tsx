import React, { useCallback } from 'react';
import { UploadCloudIcon } from './Icons';
import { useTranslation, Trans } from 'react-i18next';

interface HeroProps {
  onFilesSelected: (files: File[]) => void;
}

const Hero: React.FC<HeroProps> = ({ onFilesSelected }) => {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
          {t('hero.title')}
        </h1>
        <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
          {t('hero.subtitle')} <br className="hidden md:block" />
          <Trans
            i18nKey="hero.description"
            components={{ 1: <span className="text-apple-blue font-semibold" /> }}
          />
        </p>

        <div
          className="group relative w-full max-w-2xl mx-auto bg-white rounded-3xl border-2 border-dashed border-gray-200 transition-all duration-300 hover:border-apple-blue hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={Object.keys(ALLOWED_IMAGE_TYPES).join(',')}
            onChange={handleFileInput}
            aria-label={t('hero.upload_aria_label') || "Upload images"}
          />

          <div className="py-16 px-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-50">
              <UploadCloudIcon className="w-10 h-10 text-apple-blue" />
            </div>
            <h3 className="text-xl font-semibold text-apple-dark mb-2">
              {t('hero.dropzone')}
            </h3>
            <p className="text-gray-400 text-sm">
              {t('hero.browse')}
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
          {t('hero.secure')}
        </p>
      </div>
    </section>
  );
};

export default Hero;