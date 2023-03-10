import { ISource, Listener } from './defs';

// Types
export interface Source<D> extends ISource<D> {
  // Attributes
  listeners: Set<Listener<D>>;
}

// Utils
export function source<D>(): Source<D> {
  const listeners = new Set<Listener<D>>();

  return {
    listeners,
    emit(data: D) {
      for (const listener of listeners) {
        listener(data);
      }
    },
    on(listener: Listener<D>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    off(listener: Listener<D>) {
      listeners.delete(listener);
    }
  };
}
