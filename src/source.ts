import { Source, Listener } from './defs/index.js';
import { dom$ } from './dom.js';

// Types
export interface SourceObj<D> extends Source<D> {
  // Attributes
  listeners: Set<Listener<D>>;
}

// Utils
export function source$<D>(): SourceObj<D> {
  const listeners = new Set<Listener<D>>();

  return {
    listeners,
    next(data: D) {
      for (const listener of listeners) {
        listener(data);
      }
    },
    subscribe(listener: Listener<D>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    unsubscribe(listener: Listener<D>) {
      listeners.delete(listener);
    },
    clear() {
      listeners.clear();
    }
  };
}

/** @deprecated */
export const source = source$;