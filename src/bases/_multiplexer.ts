import {
  EmitEventMap, EventData, EventKey,
  EventMap,
  IMultiplexer,
  ISource,
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
type NextCb<R> = (src: IMultiplexer<EventMap, EventMap>, key: Key) => R;

/** @internal */
type EndCb<R> = (src: ISource<unknown>) => R;

export type ListSourcesFn<T extends SourceTree> = () => Iterable<T[keyof T]>;

export type GetSourceFn<T extends SourceTree> = <K extends keyof T & KeyPart>(key: K) => T[K];

/** @internal */
export function _multiplexer<T extends SourceTree>(listSources: ListSourcesFn<T>, getSource: GetSourceFn<T>): IMultiplexer<EmitEventMap<T>, ListenEventMap<T>> {
  function routeEvent<R>(key: Key, next: NextCb<R>, end: EndCb<R>): R {
    const [part, subkey] = splitKey(key);
    const src = getSource(part);

    if (subkey) {
      return next(src as IMultiplexer<EventMap, EventMap>, subkey);
    } else {
      return end(src as ISource<unknown>);
    }
  }

  return {
    emit(key: Key, data: unknown) {
      routeEvent(key,
        (mlt, subkey) => mlt.emit(subkey, data),
        (src) => src.next(data),
      );
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
        for (const src of listSources()) {
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
