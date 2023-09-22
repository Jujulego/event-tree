import {
  AnySource,
  EmitEventMap,
  EventData, EventKey,
  Group,
  KeyPart,
  Listener,
  ListenEventMap,
  SourceTree
} from './defs/index.js';
import { multiplexer$ } from './multiplexer.js';
import { off$ } from './off.js';

// Types
export interface GroupObj<T extends SourceTree> extends Group<EmitEventMap<T>, ListenEventMap<T>> {
  // Attributes
  sources: Map<KeyPart, AnySource>;
}

export type GroupListener<T extends SourceTree> = Listener<EventData<ListenEventMap<T>>>;

// Utils
export function group$<T extends SourceTree>(map: T): GroupObj<T> {
  const mlt = multiplexer$(map);

  return Object.assign(mlt, {
    subscribe(listener: GroupListener<T>) {
      const off = off$();

      for (const key of mlt.keys()) {
        off.add(mlt.on(key as EventKey<ListenEventMap<T>>, listener));
      }

      return off;
    },
    unsubscribe(listener: GroupListener<T>) {
      for (const key of mlt.keys()) {
        mlt.off(key as EventKey<ListenEventMap<T>>, listener);
      }
    }
  });
}

/** @deprecated */
export const group = group$;
