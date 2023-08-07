import { AnySource, EmitEventMap, EventData, IGroup, KeyPart, ListenEventMap, SourceTree } from './defs/index.js';
import { multiplexer } from './multiplexer.js';
import { source, Source } from './source.js';
import { _group } from './bases/index.js';

// Types
export interface Group<T extends SourceTree> extends IGroup<EmitEventMap<T>, ListenEventMap<T>> {
  // Attributes
  sources: Map<KeyPart, AnySource>;
  listeners: Source<EventData<EmitEventMap<T>>>['listeners'];
}

// Utils
export function group<T extends SourceTree>(map: T): Group<T> {
  const mlt = multiplexer(map);
  const src = source<EventData<EmitEventMap<T>>>();

  return {
    sources: mlt.sources,
    listeners: src.listeners,
    ..._group(mlt, src),
  };
}
