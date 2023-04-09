import { AnySource, EventMap, IMultiplexer, ISource, Key, KeyPart, Listener, OffFn } from '../defs';
import { splitKey } from '../utils';

/** @internal */
export function _multiplexer(sources: Map<KeyPart, AnySource>, getSource: (key: KeyPart) => AnySource) {
  return {
    emit(key: Key, data: unknown) {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        (src as IMultiplexer<EventMap, EventMap>).emit(subkey, data);
      } else {
        (src as ISource<unknown>).emit(data);
      }
    },

    on(key: Key, listener: Listener<any>): OffFn {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        return (src as IMultiplexer<EventMap, EventMap>).on(subkey, listener);
      } else {
        return (src as ISource<unknown>).subscribe(listener);
      }
    },

    off(key: Key, listener: Listener<any>): void {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        (src as IMultiplexer<EventMap, EventMap>).off(subkey, listener);
      } else {
        (src as ISource<unknown>).unsubscribe(listener);
      }
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