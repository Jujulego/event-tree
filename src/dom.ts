import { EventMap, IListenable, Listener } from './defs';
import { listenersMap } from './utils';

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
  const listeners = listenersMap();

  function removeListener(key: string, listener: Listener<unknown>) {
    element.removeEventListener(key, listener);
    listeners.delete(key, listener);
  }

  return {
    on(key: string, listener: Listener<unknown>) {
      element.addEventListener(key, listener);
      listeners.add(key, listener);

      return () => removeListener(key, listener);
    },
    off: removeListener,
    clear(key?: string) {
      if (key) {
        const set = listeners.list(key);

        if (set) {
          for (const lst of set) {
            element.removeEventListener(key, lst);
          }

          listeners.clear(key);
        }
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
