import { Key, PartialKey } from './key';
import { EventGroupKey, EventGroupListener, EventKey, EventListener, EventMap } from './event';

// Utils
function *partialKeys<K extends Key>(key: K): Generator<PartialKey<K>, void, undefined> {
  const parts = key.split('.');

  let pk = parts[0];
  yield pk as PartialKey<K>;

  for (let i = 1; i < parts.length; ++i) {
    pk += '.' + parts[i];
    yield pk as PartialKey<K>;
  }
}

// Class
export class ListenerTree<M extends EventMap> {
  // Attributes
  private _listeners = new Map<EventGroupKey<M>, Set<EventListener<M, EventKey<M>>>>();

  // Methods
  private _getListeners<PK extends EventGroupKey<M>>(key: PK): Set<EventGroupListener<M, PK>> {
    let set = this._listeners.get(key);

    if (!set) {
      set = new Set();
      this._listeners.set(key, set);
    }

    return set;
  }

  insert<PK extends EventGroupKey<M>>(key: PK, listener: EventGroupListener<M, PK>): void {
    const set = this._getListeners(key);
    set.add(listener);
  }

  *search<K extends EventKey<M>>(key: K): Generator<EventListener<M, K>, void, undefined> {
    for (const pk of partialKeys<EventKey<M>>(key)) {
      const set = this._listeners.get(pk);

      if (!set) {
        continue;
      }

      yield* set.values();
    }
  }

  remove<PK extends EventGroupKey<M>>(key: PK, listener: EventGroupListener<M, PK>): void {
    const set = this._listeners.get(key);

    if (set) {
      set.delete(listener as EventListener<M, EventKey<M>>);
    }
  }
}
