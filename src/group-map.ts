import {
  AnySource,
  EmitEventRecord,
  EventData,
  IGroup,
  Key,
  KeyPart,
  ListenEventRecord,
} from './defs';
import { multiplexerMap } from './multiplexer-map';
import { Source, source } from './source';

// Types
export interface GroupMap<K extends KeyPart, S extends AnySource> extends IGroup<EmitEventRecord<K, S>, ListenEventRecord<K, S>> {
  // Attributes
  sources: Map<K, S>;
  listeners: Source<EventData<ListenEventRecord<K, S>>>['listeners'];
}

// Utils
export function groupMap<K extends KeyPart, S extends AnySource>(builder: (key: K) => S): GroupMap<K, S> {
  const mlt = multiplexerMap(builder);
  const src = source<any>();

  return {
    sources: mlt.sources,
    listeners: src.listeners,

    emit(key: Key, data: any) {
      mlt.emit(key, data);
      src.emit(data);
    },

    on: mlt.on,
    off: mlt.off,

    subscribe: src.subscribe,
    unsubscribe: src.unsubscribe,

    clear(key?: Key) {
      mlt.clear(key);

      if (!key) {
        src.clear();
      }
    }
  };
}
