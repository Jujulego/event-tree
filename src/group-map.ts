import {
  AnySource,
  EmitEventRecord,
  EventData,
  Group,
  Key,
  KeyPart,
  Listener,
  ListenEventRecord
} from './defs/index.js';
import { multiplexerMap$ } from './multiplexer-map.js';
import { source$, SourceObj } from './source.js';

// Types
export interface GroupMap<K extends KeyPart, S extends AnySource> extends Group<EmitEventRecord<K, S>, ListenEventRecord<K, S>> {
  // Attributes
  sources: Map<K, S>;
  listeners: SourceObj<EventData<ListenEventRecord<K, S>>>['listeners'];
}

// Utils
function subscribeToAll(target: AnySource, cb: Listener<unknown>) {
  if ('subscribe' in target) {
    target.subscribe(cb);
  }

  if ('keys' in target) {
    for (const key of target.keys()) {
      target.on(key, cb);
    }
  }
}

export function groupMap$<K extends KeyPart, S extends AnySource>(builder: (key: K) => S): GroupMap<K, S> {
  const src = source$<EventData<ListenEventRecord<K, S>>>();

  const mlt = multiplexerMap$((key: K) => {
    const child = builder(key);
    subscribeToAll(child, src.next as Listener<unknown>);

    return child;
  });

  return {
    keys: mlt.keys,
    emit: mlt.emit,
    on: mlt.on,
    off: mlt.off,

    subscribe: src.subscribe,
    unsubscribe: src.unsubscribe,

    clear(key?: Key) {
      mlt.clear(key);

      if (!key) {
        src.clear();
      } else {
        // Keep listener for grouped events
        mlt.on(key, src.next);
      }
    },

    sources: mlt.sources,
    listeners: src.listeners,
  };
}

/** @deprecated */
export const groupMap = groupMap$;