import React from 'react';
import { CompressedFile } from '../types';
import { FileIcon, TrashIcon, CheckIcon, LoaderIcon, DownloadIcon, AlertCircleIcon } from './Icons';

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

const FileList: React.FC<FileListProps> = ({ files, onRemove, onCompress, isCompressing }) => {
  if (files.length === 0) return null;

  const readyCount = files.filter(f => f.status === 'ready').length;
  const doneCount = files.filter(f => f.status === 'done').length;
  const allDone = files.length > 0 && files.every(f => f.status === 'done');

  return (
    <div className="max-w-3xl mx-auto px-6 pb-20 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {files.map((file) => (
            <div key={file.id} className="p-4 md:p-5 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  file.status === 'done' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-500'
                }`}>
                  {file.status === 'done' ? <CheckIcon className="w-6 h-6" /> : <FileIcon className="w-6 h-6" />}
                </div>
                
                <div className="min-w-0">
                  <p className="text-sm font-medium text-apple-dark truncate max-w-[150px] md:max-w-[300px]">
                    {file.originalFile.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">{formatBytes(file.originalSize)}</span>
                    {file.status === 'done' && file.compressedSize && (
                      <>
                        <span className="text-gray-300">→</span>
                        <span className="text-apple-dark font-semibold">{formatBytes(file.compressedSize)}</span>
                        <span className="text-green-500 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                           - {Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100)}%
                        </span>
                      </>
                    )}
                    {file.status === 'error' && (
                      <span className="text-red-500 flex items-center gap-1">
                         {file.error || 'Failed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {file.status === 'ready' && (
                  <span className="hidden md:inline-block text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    Ready
                  </span>
                )}
                
                {file.status === 'compressing' && (
                  <div className="flex items-center gap-2 text-xs font-medium text-apple-blue">
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    <span className="hidden md:inline">Compressing...</span>
                  </div>
                )}

                {file.status === 'done' && file.downloadUrl && (
                  <a 
                    href={file.downloadUrl} 
                    download={`optimized-${file.originalFile.name}`}
                    className="flex items-center gap-2 bg-black text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-md shadow-black/10"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span className="hidden md:inline">Download</span>
                  </a>
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
             {files.length} file{files.length !== 1 ? 's' : ''} selected
             {allDone && (
               <span className="ml-2 text-green-600">
                 🎉 All optimizations complete
               </span>
             )}
           </div>
           
           <div className="flex w-full md:w-auto gap-3">
             {allDone ? (
               <button 
                 onClick={() => window.location.reload()} 
                 className="w-full md:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all shadow-sm"
               >
                 Start Over
               </button>
             ) : (
                <button 
                  onClick={onCompress}
                  disabled={isCompressing || readyCount === 0}
                  className={`
                    w-full md:w-auto px-8 py-3 rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2
                    ${isCompressing || readyCount === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-apple-blue text-white hover:bg-blue-600 hover:scale-[1.02] active:scale-95'
                    }
                  `}
                >
                  {isCompressing ? (
                    <>
                      <LoaderIcon className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Compress All Images</>
                  )}
                </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FileList;