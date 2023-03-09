import { Listener, Unsubscribe } from './utils';

/**
 * Simplest event source
 */
export interface ISource<D> {
  /**
   * Emits event
   * @param data
   */
  emit(data: D): void;

  /**
   * Subscribe to event
   * @param listener
   */
  subscribe(listener: Listener<D>): Unsubscribe;
}
