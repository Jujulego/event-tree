import { EventMap, IListenable, Listener } from './defs';

export interface DomEmitter<M> {
  addEventListener<K extends keyof M>(type: K, listener: (event: M[K]) => void): void;
  removeEventListener<K extends keyof M>(type: K, listener: (event: M[K]) => void): void;
}

/**
 * Wraps an dom element
 * @param element
 */
export function dom<M = HTMLElementEventMap>(element: DomEmitter<M>): IListenable<M & Record<never, never>>;

export function dom(element: DomEmitter<EventMap>): IListenable<EventMap> {
  const listeners = new Map<string, Set<Listener<unknown>>>();

  function removeListener(key: string, listener: Listener<unknown>) {
    element.removeEventListener(key, listener);
    listeners.get(key)?.delete(listener);
  }

  return {
    on(key: string, listener: Listener<unknown>) {
      element.addEventListener(key, listener);

      const set = listeners.get(key);

      if (set) {
        set.add(listener);
      } else {
        listeners.set(key, new Set([listener]));
      }

      return () => removeListener(key, listener);
    },
    off: removeListener,
    clear(key?: string) {
      if (key) {
        for (const lst of listeners.get(key) ?? []) {
          element.removeEventListener(key, lst);
        }

        listeners.delete(key);
      } else {
        for (const [key, set] of listeners.entries()) {
          for (const lst of set) {
            element.removeEventListener(key, lst);
          }
        }

        listeners.clear();
      }
    }
  };
}
