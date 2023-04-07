import { Listener, OffFn } from './utils';

export interface IObservable<D> {
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
