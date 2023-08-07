import { EventData, EventKey, EventMap } from './event-map.js';
import { IObservable } from './observable.js';
import { IMultiplexer } from './multiplexer.js';

/**
 * Multiplexer that can be observed.
 * It's listeners would be called each time a child emits
 */
export interface IGroup<EmitMap extends EventMap, ListenMap extends EventMap>
  extends IObservable<EventData<EmitMap>>, IMultiplexer<EmitMap, ListenMap> {
  /**
   * Unregister all listeners, or only "key" listeners if given
   */
  clear(key?: EventKey<ListenMap>): void;
}
