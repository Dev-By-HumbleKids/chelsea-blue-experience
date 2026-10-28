import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Toast {
  id: number;
  text: string;
  tone: 'success' | 'info';
}

let nextId = 1;

/** Fire-and-forget toast. Rendered by <Toaster/> in an aria-live region. */
export function toast(text: string, tone: Toast['tone'] = 'success') {
  window.dispatchEvent(new CustomEvent<Toast>('cfc-toast', { detail: { id: nextId++, text, tone } }));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const t = (e as CustomEvent<Toast>).detail;
      setItems((s) => [...s, t]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== t.id)), 3800);
    };
    window.addEventListener('cfc-toast', on);
    return () => window.removeEventListener('cfc-toast', on);
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2" aria-live="polite" role="status">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex items-center gap-3 rounded-xl bg-midnight-700/95 px-4 py-3 text-sm shadow-2xl ring-1 ring-white/10 backdrop-blur">
            {t.tone === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" /> : <Info className="h-4 w-4 shrink-0 text-sky-300" />}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
