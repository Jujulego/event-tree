import { Listener, OffFn } from './utils.js';

/**
 * Object allowing to observe one kind of events
 */
export interface Observable<D = unknown> {
  /**
   * Subscribe to event
   * @param listener
   */
  subscribe(listener: Listener<D>): OffFn;

  /**
   * Unsubscribe to event
   * @param listener
   */
  unsubscribe(listener: Listener<D>): void;

  /**
   * Unregister all listeners
   */
  clear(): void;
}

// Utils
export type ObservedValue<O extends Observable> = O extends Observable<infer D> ? D : never;