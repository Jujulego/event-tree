import { EventData, EventKey, EventMap } from './event-map';
import { IObservable } from './observable';
import { IMultiplexer } from './multiplexer';

/**
 * Multiplexer that can be observed.
 * It's listeners would be called each time a child emits
 */
export interface IGroup<EmitMap extends EventMap, ListenMap extends EventMap>
  extends IObservable<EventData<ListenMap>>, IMultiplexer<EmitMap, ListenMap> {
  /**
   * Unregister all listeners, or only "key" listeners if given
   */
  clear(key?: EventKey<ListenMap>): void;
}
