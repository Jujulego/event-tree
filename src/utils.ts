import { EventGroupData, EventGroupKey, EventMap, EventObservable } from './event';
import { JoinKey, Key, KeyPart, SplitKey } from './key';

// Utils
export function splitKey<K extends Key>(key: K): SplitKey<K> {
  return key.split('.') as SplitKey<K>;
}

export function joinKey<S extends readonly KeyPart[]>(key: S): JoinKey<S> {
  return key.join('.') as JoinKey<S>;
}

export async function waitForEvent<M extends EventMap, PK extends EventGroupKey<M>>(
  source: EventObservable<M>,
  key: PK
): Promise<EventGroupData<M, PK>> {
  return new Promise((resolve) => {
    const unsub = source.subscribe<PK>(key, (data: EventGroupData<M, PK>) => {
      resolve(data);
      unsub();
    });
  });
}
