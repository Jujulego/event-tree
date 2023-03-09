import { EventData, EventGroupKey, EventGroupListener, EventKey, EventMap } from './event-map';
import { Listener, OffFn } from './utils';

/**
 * Group event source
 */
export interface ISourceGroup<M extends EventMap> {
  /**
   * Emit one event
   */
  emit<K extends EventKey<M>>(key: K, data: EventData<M, K>): void;

  /**
   * Subscribe to all events
   * @param listener
   */
  on(listener: Listener<M[keyof M]>): OffFn;

  /**
   * Subscribe to one or many events
   * @param key
   * @param listener
   */
  on<K extends EventGroupKey<M>>(key: K, listener: EventGroupListener<M, K>): OffFn;

  /**
   * Unsubscribe to all events
   * @param listener
   */
  off(listener: Listener<M[keyof M]>): void;

  /**
   * Unsubscribe to one or many events
   * @param key
   * @param listener
   */
  off<K extends EventGroupKey<M>>(key: K, listener: EventGroupListener<M, K>): void;
}
