import { useEffect, useRef, useState } from 'react';

/** Local preview response lifecycle; replace the timer with backend stream events when integrated. */
export function useResponseProgress(topic: string | undefined, requestId: number) {
  const [phase, setPhase] = useState<'thinking' | 'responding' | 'complete' | 'stopped'>('complete');
  const [visibleBlocks, setVisibleBlocks] = useState(5);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const epoch = useRef(0);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = undefined; };
  useEffect(() => {
    clear();
    const run = ++epoch.current;
    if (!topic || !requestId) { setPhase('complete'); setVisibleBlocks(5); return; }
    setPhase('thinking'); setVisibleBlocks(0);
    let count = 0;
    const next = () => {
      if (run !== epoch.current) return;
      count += 1; setVisibleBlocks(count);
      setPhase(count === 5 ? 'complete' : 'responding');
      if (count < 5) timer.current = setTimeout(next, 650);
      else timer.current = undefined;
    };
    timer.current = setTimeout(next, 1000);
    return () => { ++epoch.current; clear(); };
  }, [topic, requestId]);
  const stop = () => { ++epoch.current; clear(); setPhase('stopped'); };
  return { phase, visibleBlocks, busy: phase === 'thinking' || phase === 'responding', stop };
}
