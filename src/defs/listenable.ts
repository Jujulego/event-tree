import { Listener, OffFn } from './utils';

export interface IListenable<D> {
  /**
   * Subscribe to event
   * @param listener
   */
  on(listener: Listener<D>): OffFn;

  /**
   * Unsubscribe to event
   * @param listener
   */
  off(listener: Listener<D>): void;
}
