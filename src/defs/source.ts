import { Listener, OffFn } from './utils';

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
  on(listener: Listener<D>): OffFn;

  /**
   * Unsubscribe to event
   * @param listener
   */
  off(listener: Listener<D>): void;
}
