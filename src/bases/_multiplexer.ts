import {
  AnySource, EventData,
  EventKey,
  EventMap,
  IMultiplexer,
  ISource,
  Key,
  KeyPart,
  Listener,
  OffFn
} from '../defs';
import { splitKey } from '../utils';

// Types
/** @internal */
type NextCb<R> = (src: IMultiplexer<EventMap, EventMap>, key: Key) => R;

/** @internal */
type EndCb<R> = (src: ISource<unknown>) => R;

/** @internal */
export function _multiplexer<EmitMap extends EventMap, ListenMap extends EventMap>(listSources: () => Iterable<AnySource>, getSource: (key: KeyPart) => AnySource): IMultiplexer<EmitMap, ListenMap> {
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

    on<const K extends EventKey<ListenMap>>(key: K, listener: Listener<EventData<ListenMap, K>>): OffFn {
      return routeEvent(key,
        (mlt, subkey) => mlt.on(subkey, listener as Listener<unknown>),
        (src) => src.subscribe(listener as Listener<unknown>),
      );
    },

    off<const K extends EventKey<ListenMap>>(key: K, listener: Listener<EventData<ListenMap, K>>): void {
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
