import { EventData, EventKey, EventListener, EventMap, EventOrigin, EventUnsubscribe } from './event';
import { ListenerTree } from './listener-tree';
import { ExtractKey, PartialKey } from './key';

// Class
export class EventSource<M extends EventMap> implements EventOrigin<M> {
  // Attributes
  private readonly _listeners = new ListenerTree<M>();

  // Methods
  emit<K extends EventKey<M>>(key: K, data: EventData<M, K>) {
    for (const listener of this._listeners.search(key)) {
      listener(data, { key, origin: this });
    }
  }

  subscribe<PK extends PartialKey<EventKey<M>>>(
    key: PK,
    listener: EventListener<M, ExtractKey<EventKey<M>, PK>>
  ): EventUnsubscribe {
    this._listeners.insert(key, listener);

    return () => this._listeners.remove(key, listener);
  }
}
