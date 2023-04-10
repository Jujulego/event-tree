import { AnySource, EmitEventMap, IMultiplexer, KeyPart, ListenEventMap, SourceTree } from './defs';
import { _multiplexer } from './bases/_multiplexer';

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

  return Object.assign(_multiplexer(() => sources.values(), getSource), {
    sources,
  });
}

