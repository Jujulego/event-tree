import { EventUnsubscribe } from './event';

// Interface
export type OffGroup = EventUnsubscribe & {
  // Methods
  add(unsub: EventUnsubscribe): void;
}

// Builder
export function offGroup(...unsubs: EventUnsubscribe[]): OffGroup {
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
