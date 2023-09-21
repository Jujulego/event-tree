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
/** @internal */
type NextCb<R> = (src: Multiplexer<EventMap, EventMap>, key: Key) => R;

/** @internal */
type EndCb<R> = (src: Source) => R;

/** @internal */
export interface MultiplexerOpts<T extends SourceTree> {
  keys(): Iterable<EventKey<ListenEventMap<T>>>;
  sources(): Iterable<T[keyof T & KeyPart]>;
  getSource<K extends keyof T & KeyPart>(key: K): T[K];
}

/** @internal */
export function _multiplexer$<T extends SourceTree>(opts: MultiplexerOpts<T>): Multiplexer<EmitEventMap<T>, ListenEventMap<T>> {
  function routeEvent<R>(key: Key, next: NextCb<R>, end: EndCb<R>): R {
    const [part, subkey] = splitKey(key);
    const src = opts.getSource(part);

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

    keys: opts.keys,

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
        for (const src of opts.sources()) {
          if ('clear' in src) src.clear();
        }
      } else {
        const [part, subkey] = splitKey(key);
        const src = opts.getSource(part);

        if ('clear' in src) src.clear(subkey);
      }
    }
  };
}

/** @deprecated */
export const _multiplexer = _multiplexer$;
