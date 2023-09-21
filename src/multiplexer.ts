import { _multiplexer$ } from './bases/index.js';
import { AnySource, EmitEventMap, Multiplexer, KeyPart, ListenEventMap, SourceTree, EventKey } from './defs/index.js';

// Types
export interface MultiplexerObj<T extends SourceTree> extends Multiplexer<EmitEventMap<T>, ListenEventMap<T>> {
  // Attributes
  sources: Map<KeyPart, AnySource>;
}

// Utils
export function multiplexer$<T extends SourceTree>(tree: T): MultiplexerObj<T> {
  const keys = new Set<EventKey<ListenEventMap<T>>>();
  const sources = new Map<keyof T & KeyPart, T[keyof T & KeyPart]>();

  for (const [key, src] of Object.entries(tree)) {
    sources.set(key, src as T[keyof T & KeyPart]);

    if ('subscribe' in src) {
      keys.add(key);
    }

    if ('keys' in src) {
      for (const childKey of src.keys()) {
        keys.add(`${key}.${childKey}`);
      }
    }
  }

  return Object.assign(
    _multiplexer$<T>({
      keys: () => keys,
      sources: () => sources.values(),
      getSource<K extends keyof T & KeyPart>(key: K): T[K] {
        const src = sources.get(key);

        if (!src) {
          throw new Error(`Child source ${key} not found`);
        }

        return src as T[K];
      }
    }),
    { sources }
  );
}

/** @deprecated */
export const multiplexer = multiplexer$;
