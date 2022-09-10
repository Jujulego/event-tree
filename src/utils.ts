import { EventKey, EventListener, EventMap, EventObservable } from './event';
import { ExtractKey, PartialKey } from './key';

// Utils
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
