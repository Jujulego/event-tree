import {
  EmitEventMap, EventData, EventKey,
  EventMap,
  Multiplexer,
  Source,
  Key,
  KeyPart,
  Listener,
  ListenEventMap,
  OffFn,
  SourceTree
} from '../defs/index.js';
import { splitKey } from '../utils/key.js';

// Types
type NextCb<R> = (src: Multiplexer<EventMap, EventMap>, key: Key) => R;
type EndCb<R> = (src: Source) => R;

export type SourcesMap<T extends SourceTree> = Map<keyof T & KeyPart, T[keyof T & KeyPart]>;
export type GetSourceFn<T extends SourceTree> = <K extends keyof T & KeyPart>(key: K) => T[K];

/**
 * Common base of multiplexer sources. It handles all event routing logic.
 * @internal This is an internal api, it might change at any time.
 *
 * @param sources Map object storing sources
 * @param getSource Callback used when accessing to a precise source.
 */
export function _multiplexer$<T extends SourceTree>(sources: SourcesMap<T>, getSource: GetSourceFn<T>): Multiplexer<EmitEventMap<T>, ListenEventMap<T>> {
  function routeEvent<R>(key: Key, next: NextCb<R>, end: EndCb<R>): R {
    const [part, subkey] = splitKey(key);
    const src = getSource(part);

    if (subkey) {
      return next(src as Multiplexer<EventMap, EventMap>, subkey);
    } else {
      return end(src as Source);
    }
  }

  return {
    emit(key: Key, data: unknown) {
      routeEvent(key,
        (mlt, subkey) => mlt.emit(subkey, data),
        (src) => src.next(data),
      );
    },

    *keys() {
      for (const [key, src] of sources.entries()) {
        if ('subscribe' in src) {
          yield key as EventKey<ListenEventMap<T>>;
        }

        if ('keys' in src) {
          for (const childKey of src.keys()) {
            yield `${key}.${childKey}`;
          }
        }
      }
    },

    on<K extends EventKey<ListenEventMap<T>>>(key: K, listener: Listener<EventData<ListenEventMap<T>, K>>): OffFn {
      return routeEvent(key,
        (mlt, subkey) => mlt.on(subkey, listener as Listener<unknown>),
        (src) => src.subscribe(listener as Listener<unknown>),
      );
    },

    off<K extends EventKey<ListenEventMap<T>>>(key: K, listener: Listener<EventData<ListenEventMap<T>, K>>): void {
      routeEvent(key,
        (mlt, subkey) => mlt.off(subkey, listener as Listener<unknown>),
        (src) => src.unsubscribe(listener as Listener<unknown>),
      );
    },

    clear(key?: Key): void {
      if (!key) {
        for (const src of sources.values()) {
          if ('clear' in src) src.clear();
        }
      } else {
        const [part, subkey] = splitKey(key);
        const src = getSource(part);

        if ('clear' in src) src.clear(subkey);
      }
    }
  };
}

/** @deprecated */
export const _multiplexer = _multiplexer$;
