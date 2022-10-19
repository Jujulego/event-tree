import { EventUnsubscribe } from './event';

// Interface
export type Unsubscriber = EventUnsubscribe & {
  // Methods
  add(unsub: EventUnsubscribe): void;
}

// Builder
export function unsubscriber(...unsubs: EventUnsubscribe[]): Unsubscriber {
  const set = new Set(unsubs);

  return Object.assign(() => {
    for (const unsub of set) {
      unsub();
    }
  }, {
    add(unsub: EventUnsubscribe) {
      set.add(unsub);
    }
  });
}
