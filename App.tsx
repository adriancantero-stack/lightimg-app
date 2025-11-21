import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FileList from './components/FileList';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import { CompressedFile } from './types';

// Use a unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const MAX_SIZE_MB = 10;
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    const validFiles: CompressedFile[] = newFiles
      .filter(file => {
        const isTypeValid = ALLOWED_TYPES.includes(file.type);
        const isSizeValid = file.size <= MAX_SIZE_MB * 1024 * 1024;
        
        if (!isTypeValid) alert(`File ${file.name} is not a supported image type.`);
        if (!isSizeValid) alert(`File ${file.name} is too large (Max ${MAX_SIZE_MB}MB).`);
        
        return isTypeValid && isSizeValid;
      })
      .map(file => ({
        id: generateId(),
        originalFile: file,
        status: 'ready',
        originalSize: file.size
      }));

    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // Fallback function for client-side compression if server is offline
  const compressImageLocally = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Default aggressive compression for local
        // WebP usually offers better compression than JPEG for the same quality in browser
        const outputType = file.type === 'image/png' ? 'image/jpeg' : file.type; 
        const quality = 0.6; 

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // If local compression somehow made it bigger (rare with 0.6), keep original
              if (blob.size >= file.size) {
                  // Convert file back to blob to resolve standard interface
                  resolve(file.slice(0, file.size, file.type)); 
              } else {
                  resolve(blob);
              }
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          outputType,
          quality
        );
      };

      img.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: CompressedFile): Promise<CompressedFile> => {
    const formData = new FormData();
    formData.append('image', file.originalFile);

    try {
      // Attempt Server Compression
      // Set a timeout so we don't wait too long before falling back
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      const apiUrl = 'http://localhost:3001/api/compress'; 
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Server response not ok');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      return {
        ...file,
        status: 'done',
        compressedSize: blob.size,
        compressedBlob: blob,
        downloadUrl
      };
    } catch (error) {
      console.warn(`Server failed for ${file.originalFile.name}, falling back to offline mode.`, error);
      
      // Fallback: Client-side Compression
      try {
        const localBlob = await compressImageLocally(file.originalFile);
        const downloadUrl = URL.createObjectURL(localBlob);
        
        return {
          ...file,
          status: 'done',
          compressedSize: localBlob.size,
          compressedBlob: localBlob,
          downloadUrl,
          error: undefined // Clear error if local succeeded
        };
      } catch (localError) {
        console.error("Local compression also failed", localError);
        return {
          ...file,
          status: 'error',
          error: 'Compression failed'
        };
      }
    }
  };

  const handleCompressAll = async () => {
    setIsCompressing(true);

    // Update status to compressing for all ready files
    setFiles(prev => prev.map(f => f.status === 'ready' || f.status === 'error' ? { ...f, status: 'compressing', error: undefined } : f));

    const filesToProcess = files.filter(f => f.status === 'ready' || f.status === 'error' || f.status === 'compressing');
    
    // Process sequentially to not freeze the browser UI if doing local compression on many files
    // or allow small batch parallelization
    const promises = filesToProcess.map(async (file) => {
        const result = await processFile(file);
        setFiles(prev => prev.map(f => f.id === file.id ? result : f));
    });

    await Promise.all(promises);
    setIsCompressing(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-apple-text selection:bg-apple-blue selection:text-white">
      <Header />
      <main className="w-full">
        <Hero onFilesSelected={handleFilesSelected} />
        <FileList 
          files={files} 
          onRemove={handleRemove} 
          onCompress={handleCompressAll}
          isCompressing={isCompressing}
        />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default App;