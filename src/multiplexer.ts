import {
  AnySource,
  EmitEventMap,
  EventMap,
  IMultiplexer,
  ISource,
  KeyPart, Listener, ListenEventMap,
  OffFn,
  SourceTree
} from './defs';
import { splitKey } from './utils';

// Types
export interface Multiplexer<T extends SourceTree> extends IMultiplexer<EmitEventMap<T>, ListenEventMap<T>> {
  // Attributes
  sources: Map<KeyPart, AnySource>;
}

// Utils
export function multiplexer<T extends SourceTree>(map: T): Multiplexer<T> {
  const sources = new Map<KeyPart, AnySource>(Object.entries(map));

  function getSource(key: KeyPart): AnySource {
    const src = sources.get(key);

    if (!src) {
      throw new Error(`Child source ${key} not found`);
    }

    return src;
  }

  return {
    sources,

    emit(key: string, data: unknown) {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        (src as IMultiplexer<EventMap, EventMap>).emit(subkey, data);
      } else {
        (src as ISource<unknown>).emit(data);
      }
    },

    on(key: string, listener: Listener<any>): OffFn {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        return (src as IMultiplexer<EventMap, EventMap>).on(subkey, listener);
      } else {
        return (src as ISource<unknown>).subscribe(listener);
      }
    },

    off(key: string, listener: Listener<any>): void {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        (src as IMultiplexer<EventMap, EventMap>).off(subkey, listener);
      } else {
        (src as ISource<unknown>).unsubscribe(listener);
      }
    }
  };
}
