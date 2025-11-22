import React from 'react';
import { CompressedFile } from '../types';
import { FileIcon, TrashIcon, CheckIcon, LoaderIcon, DownloadIcon } from './Icons';
import { useTranslation } from 'react-i18next';

interface FileListProps {
  files: CompressedFile[];
  onRemove: (id: string) => void;
  onCompress: () => void;
  isCompressing: boolean;
}

const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFormatBadge = (filename: string) => {
  const ext = filename.split('.').pop()?.toUpperCase() || '';
  if (['JPEG', 'JPG'].includes(ext)) return 'JPG';
  if (['TIF', 'TIFF'].includes(ext)) return 'TIFF';
  return ext;
};

const FileList: React.FC<FileListProps> = ({ files, onRemove, onCompress, isCompressing }) => {
  const { t } = useTranslation();
  if (files.length === 0) return null;

  const readyCount = files.filter(f => f.status === 'ready').length;
  const doneFiles = files.filter(f => f.status === 'done');
  const allDone = files.length > 0 && files.every(f => f.status === 'done');

  const handleDownloadAll = async () => {
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add each compressed file to ZIP
      doneFiles.forEach(file => {
        if (file.compressedBlob) {
          zip.file(file.originalFile.name, file.compressedBlob);
        }
      });

      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lightimg-compressed-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate ZIP:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pb-20 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {files.map((file) => (
            <div key={file.id} className="p-4 md:p-5 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden flex-1">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${file.status === 'done' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-500'
                  }`}>
                  {file.status === 'done' ? <CheckIcon className="w-5 h-5 md:w-6 md:h-6" /> : <FileIcon className="w-5 h-5 md:w-6 md:h-6" />}
                </div>

                <div className="min-w-0 flex flex-col gap-0.5">
                  {/* Main Line: Name + Badge + Status */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {getFormatBadge(file.originalFile.name)}
                    </span>
                    <p className="text-sm font-medium text-apple-dark truncate max-w-[120px] md:max-w-[300px]">
                      {file.originalFile.name}
                    </p>
                    {file.status === 'done' && (
                      <span className="hidden md:inline-flex text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {t('fileList.status.optimized')}
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        {t('fileList.status.error')}
                      </span>
                    )}
                  </div>

                  {/* Secondary Line 1: Reduction Info */}
                  <div className="text-xs text-gray-500">
                    {file.status === 'done' && file.compressedSize ? (
                      <>
                        {((file.originalSize - file.compressedSize) / file.originalSize) * 100 > 0 ? (
                          <span>
                            {t('fileList.reducedBy', {
                              percent: Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100),
                              original: formatBytes(file.originalSize),
                              optimized: formatBytes(file.compressedSize)
                            })}
                          </span>
                        ) : (
                          <span className="text-green-600 font-medium">
                            {t('fileList.alreadyOptimized')} ({formatBytes(file.compressedSize)})
                          </span>
                        )}
                      </>
                    ) : file.status === 'error' ? (
                      <span className="text-red-500">{file.error}</span>
                    ) : file.status === 'processing' ? (
                      <span className="text-apple-blue animate-pulse">{t('fileList.status.compressing')}... {file.progress ? `${file.progress}%` : ''}</span>
                    ) : (
                        setTimeout(() => window.URL.revokeObjectURL(url), 100);
                      } else if (file.downloadUrl) {
                        link.href = file.downloadUrl;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                    className="flex items-center gap-2 bg-black text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-md shadow-black/10"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span className="hidden md:inline">{t('fileList.download')}</span>
                  </button>
                )}

                <button
                  onClick={() => onRemove(file.id)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Remove file"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-medium text-center md:text-left">
            {files.length} {t('fileList.filesSelected')}
            {allDone && (
              <span className="ml-2 text-green-600">
                🎉 {t('fileList.allDone')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
             {doneFiles.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
              >
                <DownloadIcon className="w-4 h-4" />
                {t('fileList.downloadAll', { count: doneFiles.length })}
              </button>
            )}
            
            {readyCount > 0 && (
              <button
                onClick={onCompress}
                disabled={isCompressing}
                className={`flex-1 sm:flex-none w-full sm:w-auto px-8 py-2.5 bg-apple-blue text-white text-sm font-medium rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isCompressing ? 'opacity-75 cursor-wait' : ''
                  }`}
              >
                {isCompressing ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    {t('fileList.compressing')}
                  </>
                ) : (
                  t('fileList.compressAll')
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      </div >
      );
};

      export default FileList;