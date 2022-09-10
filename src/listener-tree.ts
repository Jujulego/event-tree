import { ExtractKey, Key, PartialKey } from './key';
import { EventKey, EventListener, EventMap } from './event';

// Utils
function *partialKeys<K extends Key>(key: K): Generator<PartialKey<K>> {
  const parts = key.split('.');
  const pk: string[] = [];

  for (let i = 0; i < parts.length; ++i) {
    pk.push(parts[i]);

    yield pk.join('.') as PartialKey<K>;
  }
}

// Class
export class ListenerTree<M extends EventMap> {
  // Attributes
  private _listeners = new Map<PartialKey<EventKey<M>>, Set<EventListener<M, EventKey<M>>>>();

  // Methods
  private _getListeners<PK extends PartialKey<EventKey<M>>>(key: PK): Set<EventListener<M, ExtractKey<EventKey<M>, PK>>> {
    let set = this._listeners.get(key);

    if (!set) {
      set = new Set<EventListener<M, EventKey<M>>>();
      this._listeners.set(key, set);
    }

    return set;
  }

  insert<PK extends PartialKey<EventKey<M>>>(key: PK, listener: EventListener<M, ExtractKey<EventKey<M>, PK>>): void {
    const set = this._getListeners(key);
    set.add(listener);
  }

  *search<K extends EventKey<M>>(key: K): Generator<EventListener<M, K>> {
    for (const pk of partialKeys<EventKey<M>>(key)) {
      const set = this._listeners.get(pk);

      if (!set) {
        continue;
      }

      for (const listener of set) {
        yield listener;
      }
    }
  }

  remove<PK extends PartialKey<EventKey<M>>>(key: PK, listener: EventListener<M, ExtractKey<EventKey<M>, PK>>): void {
    const set = this._listeners.get(key);

    if (set) {
      set.delete(listener as EventListener<M, EventKey<M>>);
    }
  }
}
