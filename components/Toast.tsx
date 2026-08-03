"use client";

import { useEffect, useState } from "react";

type ToastItem = { id: number; message: string };

// Simple module-level pub/sub so non-React code (e.g. the penalty check
// inside useMmaMode) can trigger a toast without a provider/context.
let listeners: Array<(t: ToastItem) => void> = [];
let counter = 0;

export function showToast(message: string) {
  counter += 1;
  const item: ToastItem = { id: counter, message };
  listeners.forEach((l) => l(item));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 5000);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-mma-surface border border-mma-orange/50 text-mma-white px-5 py-3 rounded-lg shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
