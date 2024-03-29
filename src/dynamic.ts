import { AnySource, DynamicSource, Dynamify, Listenable, Observable, Listener, OffFn } from './defs/index.js';
import { off$ } from './off.js';
import { listenersMap } from './utils/index.js';

function dynamicWarn(key?: string) {
  const type = key ? `"${key}" event listeners` : 'subscribers';
  console.warn(`dynamic source has registered some ${type} but current source does not support it`);
}

/**
 * Defines a dynamic source.
 * @param origin
 */
export function dynamic$<S extends Listenable | Observable>(origin: Observable<S>): Dynamify<S>;

export function dynamic$(origin: Observable<Listenable | Observable>): DynamicSource {
  const listeners = listenersMap();
  let current: AnySource | null = null;
  let off = off$();

  // Utils
  function register(key: string, set: Set<Listener<unknown>>) {
    if (!current) {
      return;
    }

    const listener = (event: unknown) => {
      for (const lst of set) {
        lst(event);
      }
    };

    if (key && 'on' in current) {
      off.add(
        current.on(key, listener)
      );
    } else if (!key && 'subscribe' in current) {
      off.add(
        current.subscribe(listener)
      );
    } else {
      dynamicWarn(key);
    }
  }

  function addListener(key: string, listener: Listener<unknown>): OffFn {
    const [set, isNew] = listeners.add(key, listener);

    if (isNew) {
      register(key, set);
    }

    return () => set.delete(listener);
  }

  function removeListener(key: string, listener: Listener<unknown>) {
    listeners.delete(key, listener);
  }

  // Listen origin
  origin.subscribe((next) => {
    // Disable current
    off();

    // Listen to next
    current = next;
    off = off$();

    for (const [key, lsts] of listeners.entries()) {
      register(key, lsts);
    }
  });

  return {
    on: addListener,
    off: removeListener,
    subscribe: (listener: Listener<unknown>) => addListener('', listener),
    unsubscribe: (listener: Listener<unknown>) => removeListener('', listener),
    clear() {
      listeners.clear();
      off();
    }
  };
}

/** @deprecated */
export const dynamic = dynamic$;
