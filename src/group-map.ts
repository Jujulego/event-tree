import { AnySource, EmitEventRecord, EventData, IGroup, KeyPart, ListenEventRecord } from './defs';
import { multiplexerMap } from './multiplexer-map';
import { source, Source } from './source';
import { _group } from './bases';

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
    ..._group(mlt, src),
  };
}
