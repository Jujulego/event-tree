import { EventKey, EventListener, EventMap, EventObservable } from './event';
import { ExtractKey, JoinKey, Key, KeyPart, PartialKey, SplitKey } from './key';

// Utils
export function splitKey<K extends Key>(key: K): SplitKey<K> {
  return key.split('.') as SplitKey<K>;
}

export function joinKey<S extends readonly KeyPart[]>(key: S): JoinKey<S> {
  return key.join('.') as JoinKey<S>;
}

export async function waitForEvent<M extends EventMap, PK extends PartialKey<EventKey<M>>>(
  source: EventObservable<M>,
  key: PK
): Promise<Parameters<EventListener<M, ExtractKey<EventKey<M>, PK>>>> {
  return new Promise((resolve) => {
    const unsub = source.subscribe<PK>(key, (...args) => {
      resolve(args);
      unsub();
    });
  });
}
