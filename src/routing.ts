import { ExtractKey, Key, PartialKey } from './key';
import { EventKey, EventListener, EventMap, EventUnsubscribe } from './event';

// Types
export type EventPair<M extends EventMap> = [M, EventKey<M>];
export type EventRoutes = Record<Key, EventPair<EventMap>>;

export type EventRouter<R extends EventRoutes> = {
  [K in keyof R & Key as 'subscribe']: <PK extends PartialKey<K>>(key: PK, listener: EventListener<R[K][0], R[ExtractKey<EventKey<R>, PK>][1]>) => EventUnsubscribe;
}['subscribe'];
