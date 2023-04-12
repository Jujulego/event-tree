import { AnyEventMap, AnySource, EventMap, IMultiplexer, ISource, Key, KeyPart, Listener, OffFn } from '../defs';
import { splitKey } from '../utils';

// Types
/** @internal */
type NextCb<R> = (src: IMultiplexer<EventMap, EventMap>, key: Key) => R;
type EndCb<R> = (src: ISource<unknown>) => R;

/** @internal */
export function _multiplexer(listSources: () => Iterable<AnySource>, getSource: (key: KeyPart) => AnySource): IMultiplexer<AnyEventMap, AnyEventMap> {
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
        (src) => src.emit(data),
      );
    },

    on(key: Key, listener: Listener<any>): OffFn {
      return routeEvent(key,
        (mlt, subkey) => mlt.on(subkey, listener),
        (src) => src.subscribe(listener),
      );
    },

    off(key: Key, listener: Listener<any>): void {
      routeEvent(key,
        (mlt, subkey) => mlt.off(subkey, listener),
        (src) => src.unsubscribe(listener),
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
