import { IObservable } from './observable';

/**
 * Simplest event source
 */
export interface ISource<D> extends IObservable<D> {
  /**
   * Emits event
   * @param data
   */
  emit(data: D): void;
}
