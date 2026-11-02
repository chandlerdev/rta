'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface SpinnerCtx {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

const Ctx = createContext<SpinnerCtx | null>(null);

export function SpinnerProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const show = useCallback(() => setCount((c) => c + 1), []);
  const hide = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);
  const visible = count > 0;

  return (
    <Ctx.Provider value={{ visible, show, hide }}>
      {children}
      {visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent sm:h-14 sm:w-14" />
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useSpinner() {
  const ctx = useContext(Ctx);
  // Safe no-op fallback so pages can call show/hide even outside provider (SSR)
  if (!ctx) {
    return { visible: false, show: () => {}, hide: () => {} };
  }
  return ctx;
}
