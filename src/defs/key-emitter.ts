import { EventData, EventKey, EventMap } from './event-map';

export interface IKeyEmitter<in M extends EventMap> {
  __emit_event_map?: ((map: M) => void) | undefined;

  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   */
  emit<const K extends EventKey<M>>(key: K, data: EventData<M, K>): void;
}
