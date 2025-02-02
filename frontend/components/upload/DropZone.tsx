"use client";

import { useCallback, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  uploading: boolean;
  uploadProgress: number;
}

export function DropZone({ onFile, uploading, uploadProgress }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-[2rem] border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
        dragging
          ? "border-blue-400 bg-blue-50/80"
          : "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 hover:border-blue-300"
      }`}
    >
      <input
        type="file"
        accept=".zip"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        disabled={uploading}
      />
      <div className="flex flex-col items-center gap-4 pointer-events-none">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-4xl shadow-lg shadow-blue-200/60">
          {uploading ? "⏳" : "☁️"}
        </div>
        {uploading ? (
          <>
            <h3 className="text-xl font-black text-slate-950">Đang tải lên…</h3>
            <div className="w-56 h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm font-bold text-slate-500">{uploadProgress}%</p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-black text-slate-950">Kéo thả file ZIP ảnh vào đây</h3>
            <p className="text-sm text-slate-500">Hỗ trợ JPG, PNG, WEBP. Có thể upload ít ảnh hoặc nhiều ảnh tuỳ dataset.</p>
          </>
        )}
      </div>
    </div>
  );
}
