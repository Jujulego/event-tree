import { AnySource, EmitEventRecord, EventData, IGroup, KeyPart, ListenEventRecord } from './defs/index.js';
import { multiplexerMap } from './multiplexer-map.js';
import { source, Source } from './source.js';
import { _group } from './bases/index.js';

// Types
export interface GroupMap<K extends KeyPart, S extends AnySource> extends IGroup<EmitEventRecord<K, S>, ListenEventRecord<K, S>> {
  // Attributes
  sources: Map<K, S>;
  listeners: Source<EventData<EmitEventRecord<K, S>>>['listeners'];
}

// Utils
export function groupMap<K extends KeyPart, S extends AnySource>(builder: (key: K) => S): GroupMap<K, S> {
  const mlt = multiplexerMap(builder);
  const src = source<EventData<EmitEventRecord<K, S>>>();

  return {
    sources: mlt.sources,
    listeners: src.listeners,
    ..._group(mlt, src),
  };
}
