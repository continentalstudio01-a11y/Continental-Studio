import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';

interface ImageDropzoneProps {
  onImagesSelected: (base64List: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  currentValue?: string;
  label?: string;
  sublabel?: string;
  className?: string;
  aspectRatio?: 'square' | 'cover' | 'auto';
  showUrlInput?: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImagesSelected,
  multiple = false,
  maxFiles = 10,
  currentValue,
  label = 'Clique ou arraste uma foto aqui',
  sublabel = 'Formatos suportados: JPG, PNG, WEBP, GIF (Até 10MB)',
  className = '',
  aspectRatio = 'auto',
  showUrlInput = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentValue || null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync current value when changed externally
  React.useEffect(() => {
    if (currentValue !== undefined) {
      setPreview(currentValue || null);
    }
  }, [currentValue]);

  const processFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length === 0) {
      alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, WEBP, etc.).');
      return;
    }

    const filePromises = validFiles.slice(0, maxFiles).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject('Erro ao ler imagem');
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then((base64Results) => {
        if (!multiple && base64Results.length > 0) {
          setPreview(base64Results[0]);
        }
        onImagesSelected(base64Results);
      })
      .catch((err) => {
        console.error('Erro ao carregar arquivos:', err);
      });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreview(urlInput.trim());
    onImagesSelected([urlInput.trim()]);
    setShowUrlField(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImagesSelected([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {!multiple && preview ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-white/20 bg-black/40">
          <img
            src={preview}
            alt="Preview"
            className={`w-full object-cover max-h-56 ${
              aspectRatio === 'square' ? 'aspect-square' : ''
            }`}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold cursor-pointer hover:bg-amber-300"
            >
              Trocar Foto
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer hover:bg-red-500"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none group ${
            isDragging
              ? 'border-amber-400 bg-amber-500/20 scale-[1.02]'
              : 'border-white/20 hover:border-amber-400/80 bg-white/5 hover:bg-white/10'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-white mb-1">{label}</p>
          <p className="text-xs text-white/50">{sublabel}</p>

          {isDragging && (
            <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-xs rounded-2xl border-2 border-amber-400 flex items-center justify-center text-amber-300 font-extrabold text-sm">
              Solte a foto aqui para enviar!
            </div>
          )}
        </div>
      )}

      {showUrlInput && (
        <div className="text-right">
          {!showUrlField ? (
            <button
              type="button"
              onClick={() => setShowUrlField(true)}
              className="text-[11px] text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
            >
              Ou colar URL da imagem
            </button>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="https://exemplo.com/imagem.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold cursor-pointer hover:bg-amber-300"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setShowUrlField(false)}
                className="p-1.5 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
