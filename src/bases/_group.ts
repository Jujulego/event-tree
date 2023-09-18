import { EventData, EventMap, Group, Multiplexer, Source, Key } from '../defs/index.js';

/** @internal */
export function _group$<EmitMap extends EventMap, ListenMap extends EventMap>(mlt: Multiplexer<EmitMap, ListenMap>, src: Source<EventData<EmitMap>>): Group<EmitMap, ListenMap> {
  return {
    emit(key: Key, data: EventData<EmitMap>) {
      mlt.emit(key, data);
      src.next(data);
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

/** @deprecated */
export const _group = _group$;