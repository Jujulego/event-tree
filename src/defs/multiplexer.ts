import { EventData, EventKey, EventMap } from './event-map';
import { IListenable } from './listenable';

export interface IMultiplexer<EmitMap extends EventMap, ListenMap extends EventMap> extends IListenable<ListenMap> {
  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   */
  emit<K extends EventKey<EmitMap>>(key: K, data: EventData<EmitMap, K>): void;
}
