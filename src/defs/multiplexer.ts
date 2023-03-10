import { EventData, EventKey, EventListener, EventMap } from './event-map';
import { OffFn } from './utils';

export interface IMultiplexer<EmitMap extends EventMap, ListenMap extends EventMap> {
  emit<K extends EventKey<EmitMap>>(key: K, data: EventData<EmitMap, K>): void;

  on<K extends EventKey<ListenMap>>(key: K, listener: EventListener<ListenMap, K>): OffFn;

  off<K extends EventKey<ListenMap>>(key: K, listener: EventListener<ListenMap, K>): void;
}
