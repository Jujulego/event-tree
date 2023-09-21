import { _multiplexer$ } from './bases/index.js';
import { AnySource, EmitEventMap, Multiplexer, KeyPart, ListenEventMap, SourceTree, EventKey } from './defs/index.js';

// Types
export interface MultiplexerObj<T extends SourceTree> extends Multiplexer<EmitEventMap<T>, ListenEventMap<T>> {
  // Attributes
  sources: Map<KeyPart, AnySource>;
}

// Utils
export function multiplexer$<T extends SourceTree>(tree: T): MultiplexerObj<T> {
  const sources = new Map(Object.entries(tree) as [keyof T & KeyPart, T[keyof T & KeyPart]][]);

  return Object.assign(
    _multiplexer$<T>({
      *keys() {
        for (const [key, src] of sources.entries()) {
          if ('subscribe' in src) {
            yield key as EventKey<ListenEventMap<T>>;
          }

          if ('keys' in src) {
            for (const childKey of src.keys()) {
              yield `${key}.${childKey}`;
            }
          }
        }
      },
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
