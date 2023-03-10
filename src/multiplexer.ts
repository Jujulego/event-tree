import {
  AssertEventMap,
  EventKey, EventMap,
  IMultiplexer,
  ISource,
  KeyPart, Listener,
  MapValueIntersection, OffFn,
  PrependEventMapKeys
} from './defs';

// Types
export type SourceMap = Record<KeyPart, ISource<any> | IMultiplexer<any>>;

export type EventMapOfSources<SM extends SourceMap> = {
  [K in EventKey<SM>]: SM[K] extends ISource<infer D>
    ? Record<K, D>
    : SM[K] extends IMultiplexer<infer M>
      ? PrependEventMapKeys<K, M>
      : never
}

export type MultiplexerEventMap<SM extends SourceMap> = AssertEventMap<MapValueIntersection<EventMapOfSources<SM>>>;

export interface Multiplexer<M extends EventMap> extends IMultiplexer<M> {
  // Attributes
  sources: Map<KeyPart, ISource<unknown> | IMultiplexer<EventMap>>;
}

// Utils
export function multiplexer<SM extends SourceMap>(map: SM): Multiplexer<MultiplexerEventMap<SM>> {
  const sources = new Map<KeyPart, ISource<unknown> | IMultiplexer<EventMap>>(Object.entries(map));

  function getSource(key: KeyPart) {
    const src = sources.get(key);

    if (!src) {
      throw new Error(`source ${key} not found`);
    }

    return src;
  }

  function splitKey(key: string): [string, string] {
    const idx = key.indexOf('.');

    if (idx === -1) {
      return [key, ''];
    } else {
      return [key.slice(0, idx), key.slice(idx + 1)];
    }
  }

  return {
    sources,

    emit(key: string, data: unknown) {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        (src as IMultiplexer<EventMap>).emit(subkey, data);
      } else {
        (src as ISource<unknown>).emit(data);
      }
    },

    on(key: string, listener: Listener<any>): OffFn {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        return (src as IMultiplexer<EventMap>).on(subkey, listener);
      } else {
        return (src as ISource<unknown>).subscribe(listener);
      }
    },

    off(key: string, listener: Listener<any>): void {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        (src as IMultiplexer<EventMap>).off(subkey, listener);
      } else {
        (src as ISource<unknown>).unsubscribe(listener);
      }
    }
  };
}
