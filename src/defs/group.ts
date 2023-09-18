import { EventData, EventKey, EventMap } from './event-map.js';
import { Observable } from './observable.js';
import { Multiplexer } from './multiplexer.js';

/**
 * Multiplexer that can be observed.
 * It's listeners would be called each time a child emits
 */
export interface Group<EmitMap extends EventMap, ListenMap extends EventMap>
  extends Observable<EventData<EmitMap>>, Multiplexer<EmitMap, ListenMap> {
  /**
   * Unregister all listeners, or only "key" listeners if given
   */
  clear(key?: EventKey<ListenMap>): void;
}
