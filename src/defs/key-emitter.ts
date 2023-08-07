import { EventData, EventKey, EventMap } from './event-map.js';

export interface IKeyEmitter<M extends EventMap> {
  __emit_event_map?: M | undefined;

  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   */
  emit<K extends EventKey<M>>(key: K, data: EventData<M, K>): void;
}
