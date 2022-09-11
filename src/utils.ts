import { EventGroupData, EventGroupKey, EventMap, EventObservable } from './event';
import { JoinKey, Key, KeyPart, PartialKey, SplitKey } from './key';

// Utils
export function splitKey<K extends Key>(key: K): SplitKey<K> {
  return key.split('.') as SplitKey<K>;
}

export function joinKey<S extends KeyPart[]>(...parts: S): JoinKey<S>;
export function joinKey<P1 extends KeyPart, P2 extends KeyPart>(p1: P1, p2?: P2): `${P1}` | `${P1}.${P2}`;
export function joinKey<P1 extends KeyPart, P2 extends KeyPart, P3 extends KeyPart>(p1: P1, p2?: P2, p3?: P3): `${P1}` | `${P1}.${P2}` | `${P1}.${P2}.${P3}`;
export function joinKey<P1 extends KeyPart, P2 extends KeyPart, P3 extends KeyPart, P4 extends KeyPart>(p1: P1, p2?: P2, p3?: P3, p4?: P4): `${P1}` | `${P1}.${P2}` | `${P1}.${P2}.${P3}` | `${P1}.${P2}.${P3}.${P4}`;
export function joinKey(...parts: Array<KeyPart | undefined>): Key {
  return parts.filter(p => p).join('.');
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
