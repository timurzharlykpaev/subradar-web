
import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface ReceiptUploaderProps {
  onUpload?: (file: File) => void;
  subscriptionId?: string;
}

export function ReceiptUploader({ onUpload }: ReceiptUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/') || f.type === 'application/pdf'
      );
      setFiles((prev) => [...prev, ...dropped]);
      dropped.forEach((f) => onUpload?.(f));
    },
    [onUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    selected.forEach((f) => onUpload?.(f));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-gray-600 hover:border-purple-500/50'
        }`}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-400">
          Drag & drop receipts here or{' '}
          <label className="text-purple-400 cursor-pointer hover:underline">
            browse
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInput}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(0)}KB
              </span>
              <button onClick={() => removeFile(i)}>
                <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
