import { AnySource, EmitEventMap, IMultiplexer, KeyPart, ListenEventMap, SourceTree } from './defs';
import { _multiplexer } from './bases';

// Types
export interface Multiplexer<T extends SourceTree> extends IMultiplexer<EmitEventMap<T>, ListenEventMap<T>> {
  // Attributes
  sources: Map<KeyPart, AnySource>;
}

// Utils
export function multiplexer<T extends SourceTree>(map: T): Multiplexer<T> {
  const sources = new Map(Object.entries(map) as [keyof T & KeyPart, T[keyof T & KeyPart]][]);

  function getSource<K extends keyof T & KeyPart>(key: K): T[K] {
    const src = sources.get(key);

    if (!src) {
      throw new Error(`Child source ${key} not found`);
    }

    return src as T[K];
  }

  return Object.assign(
    _multiplexer<T>(() => sources.values(), getSource),
    { sources }
  );
}

