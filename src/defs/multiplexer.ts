import { EventData, EventKey, EventListener, EventMap } from './event-map';
import { OffFn } from './utils';

export interface IMultiplexer<M extends EventMap> {
  emit<K extends EventKey<M>>(key: K, data: EventData<M, K>): void;

  on<K extends EventKey<M>>(key: K, listener: EventListener<M, K>): OffFn;

  off<K extends EventKey<M>>(key: K, listener: EventListener<M, K>): void;
}
