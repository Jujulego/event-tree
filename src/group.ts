import { EmitEventMap, EventData, IGroup, ListenEventMap, SourceTree } from './defs';
import { multiplexer, Multiplexer } from './multiplexer';
import { Source, source } from './source';

// Types
export interface Group<T extends SourceTree> extends IGroup<EmitEventMap<T>, ListenEventMap<T>>, Multiplexer<T> {
  // Attributes
  listeners: Source<EventData<ListenEventMap<T>>>['listeners'];
}

// Utils
export function group<T extends SourceTree>(map: T): Group<T> {
  const mlt = multiplexer(map);
  const src = source<any>();

  return {
    sources: mlt.sources,
    listeners: src.listeners,

    emit(key: string, data: any) {
      mlt.emit(key, data);
      src.emit(data);
    },

    on: mlt.on,
    off: mlt.off,

    subscribe: src.subscribe,
    unsubscribe: src.unsubscribe,
  };
}
