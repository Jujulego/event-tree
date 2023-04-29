import { AnySource, DynamicSource, Dynamify, EventMap, IListenable, IObservable, Listener, OffFn } from './defs';
import { offGroup } from './off-group';
import { Source } from './source';

function dynamicWarn(key?: string) {
  const type = key ? `"${key} event listeners` : 'subscribers';
  console.warn(`dynamic source has registered some ${type} but current source does not support it`);
}

/**
 * Defines a dynamic source.
 * @param origin
 */
export function dynamic<S extends IListenable<EventMap> | IObservable<unknown>>(origin: Source<S>): Dynamify<S>;

export function dynamic(origin: Source<IListenable<EventMap> | IObservable<unknown>>): DynamicSource {
  const listeners = new Map<string, Set<Listener<unknown>>>();
  let current: AnySource | null = null;
  let off = offGroup();

  // Utils
  function register(key: string, listeners: Set<Listener<unknown>>) {
    if (!current) {
      return;
    }

    const listener = (event: unknown) => {
      for (const lst of listeners) {
        lst(event);
      }
    };

    if (key) {
      if ('on' in current) {
        off.add(
          current.on(key, listener)
        );
      } else {
        dynamicWarn(key);
      }
    } else {
      if ('subscribe' in current) {
        off.add(
          current.subscribe(listener)
        );
      } else {
        dynamicWarn();
      }
    }
  }

  function addListener(key: string, listener: Listener<unknown>): OffFn {
    let lsts = listeners.get(key);

    if (lsts) {
      lsts.add(listener);
    } else {
      lsts = new Set([listener]);

      listeners.set(key, lsts);
      register(key, lsts);
    }

    return () => lsts?.delete(listener);
  }

  function removeListener(key: string, listener: Listener<unknown>) {
    listeners.get(key)?.delete(listener);
  }

  // Listen origin
  origin.subscribe((next) => {
    // Disable current
    off();

    // Listen to next
    current = next;
    off = offGroup();

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
