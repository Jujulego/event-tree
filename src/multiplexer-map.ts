import { AnySource, EmitEventValue, IMultiplexer, KeyPart, ListenEventValue } from './defs';
import { _multiplexer } from './bases/_multiplexer';

// Types
export interface MultiplexerMap<K extends KeyPart, S extends AnySource>
  extends IMultiplexer<Record<K, EmitEventValue<K, S>>, Record<K, ListenEventValue<K, S>>> {
  // Attributes
  sources: Map<K, S>;
}

// Utils
export function multiplexerMap<K extends KeyPart, S extends AnySource>(builder: (key: K) => S): MultiplexerMap<K, S> {
  const sources = new Map<K, S>();

  function getSource(key: KeyPart): AnySource {
    let src = sources.get(key as K);

    if (!src) {
      src = builder(key as K);
      sources.set(key as K, src);
    }

    return src;
  }

  return Object.assign(_multiplexer(sources, getSource), {
    sources,
  });
}