import { EventData, EventKey, EventMap } from './event-map';

export interface IKeyEmitter<M extends EventMap> {
  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   */
  emit<K extends EventKey<M>>(key: K, data: EventData<M, K>): void;
}
