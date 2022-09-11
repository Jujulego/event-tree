import {
  EventData, EventGroupKey,
  EventGroupListener,
  EventKey,
  EventMap,
  EventOrigin,
  EventUnsubscribe
} from './event';
import { ListenerTree } from './listener-tree';

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

  subscribe<GK extends EventGroupKey<M>>(key: GK, listener: EventGroupListener<M, GK>): EventUnsubscribe {
    this._listeners.insert(key, listener);

    return () => this._listeners.remove(key, listener);
  }
}
