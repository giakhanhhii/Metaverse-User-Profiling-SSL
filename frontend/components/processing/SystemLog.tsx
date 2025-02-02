"use client";

import { useEffect, useRef } from "react";

interface Props {
  logs: string[];
}

export function SystemLog({ logs }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [logs]);

  return (
    <div
      ref={ref}
      className="bg-gray-900 rounded-xl p-4 h-40 overflow-y-auto font-mono text-xs text-green-400 space-y-1"
    >
      {logs.length === 0 ? (
        <span className="text-gray-600">Đang chờ pipeline bắt đầu…</span>
      ) : (
        logs.map((l, i) => (
          <div key={i}>
            <span className="text-gray-600 mr-2">[{String(i + 1).padStart(2, "0")}]</span>
            {l}
          </div>
        ))
      )}
      <span className="inline-block animate-pulse">▋</span>
    </div>
  );
}
