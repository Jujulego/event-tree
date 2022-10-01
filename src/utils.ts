import { EventGroupData, EventGroupKey, EventListenerOptions, EventMap, EventObservable } from './event';
import { JoinKey, Key, KeyPart as KP, PartialKey, SplitKey } from './key';

// Utils
export function splitKey<K extends Key>(key: K): SplitKey<K> {
  return key.split('.') as SplitKey<K>;
}

export function joinKey<S extends [KP, ...KP[]]>(...parts: S): JoinKey<S>;
export function joinKey<P1 extends KP, P2 extends KP>(p1: P1, p2?: P2): PartialKey<`${P1}.${P2}`>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP>(p1: P1, p2: P2, p3?: P3): JoinKey<[P1, PartialKey<`${P2}.${P3}`>]>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP>(p1: P1, p2?: P2, p3?: P3): PartialKey<`${P1}.${P2}.${P3}`>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP, P4 extends KP>(p1: P1, p2: P2, p3: P3, p4?: P4): JoinKey<[P1, P2, PartialKey<`${P3}.${P4}`>]>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP, P4 extends KP>(p1: P1, p2: P2, p3?: P3, p4?: P4): JoinKey<[P1, PartialKey<`${P2}.${P3}.${P4}`>]>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP, P4 extends KP>(p1: P1, p2?: P2, p3?: P3, p4?: P4): PartialKey<`${P1}.${P2}.${P3}.${P4}`>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP, P4 extends KP, P5 extends KP>(p1: P1, p2: P2, p3: P3, p4: P4, p5?: P5): JoinKey<[P1, P2, P3, PartialKey<`${P4}.${P5}`>]>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP, P4 extends KP, P5 extends KP>(p1: P1, p2: P2, p3: P3, p4?: P4, p5?: P5): JoinKey<[P1, P2, PartialKey<`${P3}.${P4}.${P5}`>]>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP, P4 extends KP, P5 extends KP>(p1: P1, p2: P2, p3?: P3, p4?: P4, p5?: P5): JoinKey<[P1, PartialKey<`${P2}.${P3}.${P4}.${P5}`>]>;
export function joinKey<P1 extends KP, P2 extends KP, P3 extends KP, P4 extends KP, P5 extends KP>(p1: P1, p2?: P2, p3?: P3, p4?: P4, p5?: P5): PartialKey<`${P1}.${P2}.${P3}.${P4}.${P5}`>;
export function joinKey(...parts: Array<KP | undefined>): Key {
  const key: KP[] = [];

  for (const part of parts) {
    if (part === undefined) {
      break;
    }

    key.push(part);
  }

  return key.join('.');
}

export async function waitForEvent<M extends EventMap, GK extends EventGroupKey<M>>(
  source: EventObservable<M>,
  key: GK,
  opts: EventListenerOptions = {}
): Promise<EventGroupData<M, GK>> {
  return new Promise((resolve, reject) => {
    // Subscribe to event
    const unsub = source.subscribe<GK>(key, (data: EventGroupData<M, GK>) => {
      resolve(data);
      unsub();
    }, opts);

    // Use signal to reject if aborted
    if (opts.signal) {
      opts.signal.addEventListener('abort', () => reject(opts.signal!.reason), { once: true });
    }
  });
}

export async function* streamEvents<M extends EventMap, GK extends EventGroupKey<M>>(
  source: EventObservable<M>,
  key: GK,
  opts: EventListenerOptions = {}
): AsyncGenerator<EventGroupData<M, GK>> {
  while (true) {
    yield await waitForEvent<M, GK>(source, key, opts);
  }
}
