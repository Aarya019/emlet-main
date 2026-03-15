'use client';

import { useRef, useState } from 'react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  /** compact mode for inline use (e.g. gallery rows) */
  compact?: boolean;
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  onRemove,
  placeholder = 'https://…',
  compact = false,
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed');
      } else {
        onChange(data.url);
      }
    } catch {
      setUploadError('Network error during upload');
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  if (compact) {
    return (
      <div className="flex gap-1 items-center flex-1">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20"
          placeholder={placeholder}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload image"
          className="flex-shrink-0 p-1 rounded border border-white/10 bg-white/5 hover:border-[#00ffff]/50 hover:bg-[#00ffff]/10 transition-all disabled:opacity-40"
        >
          {uploading ? (
            <svg className="w-3.5 h-3.5 text-[#00ffff] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-white/40 hover:text-[#00ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-white/40 uppercase tracking-wider">{label}</label>
        {value && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-0 py-1.5 bg-transparent border-0 border-b border-white/10 text-white focus:outline-none focus:border-[#00ffff] transition-colors placeholder-white/20 text-sm"
          placeholder={placeholder}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload image"
          className="flex-shrink-0 px-2.5 py-1.5 rounded border border-white/10 bg-white/5 hover:border-[#00ffff]/50 hover:bg-[#00ffff]/10 text-white/50 hover:text-[#00ffff] transition-all text-xs flex items-center gap-1.5 disabled:opacity-40"
        >
          {uploading ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
            </>
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {uploadError && (
        <p className="text-[11px] text-red-400 mt-1">{uploadError}</p>
      )}
    </div>
  );
}
