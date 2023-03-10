import { EventData, EventGroupKey, EventGroupListener, EventKey, EventMap } from './event-map';
import { Listener, OffFn } from './utils';
import { IObservable } from './observable';

/**
 * Group event source
 */
export interface IGroup<M extends EventMap> extends IObservable<M[keyof M]> {
  /**
   * Emit one event
   */
  emit<K extends EventKey<M>>(key: K, data: EventData<M, K>): void;

  /**
   * Subscribe to all events
   * @param listener
   */
  subscribe(listener: Listener<M[keyof M]>): OffFn;

  /**
   * Subscribe to one or many events
   * @param key
   * @param listener
   */
  subscribe<K extends EventGroupKey<M>>(key: K, listener: EventGroupListener<M, K>): OffFn;

  /**
   * Unsubscribe to all events
   * @param listener
   */
  unsubscribe(listener: Listener<M[keyof M]>): void;

  /**
   * Unsubscribe to one or many events
   * @param key
   * @param listener
   */
  unsubscribe<K extends EventGroupKey<M>>(key: K, listener: EventGroupListener<M, K>): void;
}
