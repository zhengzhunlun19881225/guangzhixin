import { useLayoutEffect, useState } from 'react';

export type UIMode = 'original' | 'spec';
const key = 'guangxin-ui-mode';
export function useUIMode() {
  const [mode, setMode] = useState<UIMode>(() => {
    try { return localStorage.getItem(key) === 'spec' ? 'spec' : 'original'; } catch { return 'original'; }
  });
  useLayoutEffect(() => {
    document.documentElement.dataset.uiMode = mode;
    try { localStorage.setItem(key, mode); } catch { /* The current page can still switch when storage is unavailable. */ }
    return () => { delete document.documentElement.dataset.uiMode; };
  }, [mode]);
  return [mode, setMode] as const;
}
