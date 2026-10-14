'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DemoState, emptyState, loadDemo, saveDemo } from '@/lib/demo';

type DemoContextValue = {
  state: DemoState;
  ready: boolean;
  persistent: boolean;
  update: (change: (current: DemoState) => DemoState) => Promise<void>;
  reset: () => void;
};
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(emptyState);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const stateRef = useRef(state);
  const saveQueue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    loadDemo().then(value => {
      if (!active) return;
      stateRef.current = value;
      setState(value);
      setReady(true);
    }).catch(() => {
      if (!active) return;
      setPersistent(false);
      setReady(true);
    });
    return () => { active = false; };
  }, []);
  const update = useCallback((change: (current: DemoState) => DemoState) => {
    const next = change(stateRef.current);
    stateRef.current = next;
    setState(next);
    if (persistent) {
      saveQueue.current = saveQueue.current.then(() => saveDemo(next)).catch(() => { setPersistent(false); });
      return saveQueue.current;
    }
    return Promise.resolve();
  }, [persistent]);
  const reset = useCallback(() => update(() => emptyState()), [update]);
  return <DemoContext.Provider value={{ state, ready, persistent, update, reset }}>
    {!persistent && <div className="storage-alert" role="status">浏览器未开放本地存储；当前修改仅在本次页面会话有效。</div>}
    {children}
  </DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
