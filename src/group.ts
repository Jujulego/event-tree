import { AnySource, EmitEventMap, EventData, Group, KeyPart, ListenEventMap, SourceTree } from './defs/index.js';
import { multiplexer$ } from './multiplexer.js';
import { source$, SourceObj } from './source.js';
import { _group } from './bases/index.js';
import { dom$ } from './dom.js';

// Types
export interface GroupObj<T extends SourceTree> extends Group<EmitEventMap<T>, ListenEventMap<T>> {
  // Attributes
  sources: Map<KeyPart, AnySource>;
  listeners: SourceObj<EventData<EmitEventMap<T>>>['listeners'];
}

// Utils
export function group$<T extends SourceTree>(map: T): GroupObj<T> {
  const mlt = multiplexer$(map);
  const src = source$<EventData<EmitEventMap<T>>>();

  return {
    sources: mlt.sources,
    listeners: src.listeners,
    ..._group(mlt, src),
  };
}

/** @deprecated */
export const group = group$;