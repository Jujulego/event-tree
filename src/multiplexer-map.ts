import { _multiplexer$ } from './bases/index.js';
import { AnySource, EmitEventRecord, Multiplexer, KeyPart, ListenEventRecord } from './defs/index.js';

// Types
export interface MultiplexerMap<K extends KeyPart, S extends AnySource> extends Multiplexer<EmitEventRecord<K, S>, ListenEventRecord<K, S>> {
  // Attributes
  sources: Map<K, S>;
}

// Utils
export function multiplexerMap$<K extends KeyPart, S extends AnySource>(builder: (key: K) => S): MultiplexerMap<K, S> {
  const sources = new Map<K, S>();

  function getSource(key: K): S {
    let src = sources.get(key as K);

    if (!src) {
      src = builder(key as K);
      sources.set(key as K, src);
    }

    return src;
  }

  return Object.assign(
    _multiplexer$<Record<K, S>>(sources, getSource),
    { sources }
  );
}

/** @deprecated */
export const multiplexerMap = multiplexerMap$;
