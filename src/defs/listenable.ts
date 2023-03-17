import { EventKey, EventListener, EventMap } from './event-map';
import { OffFn } from './utils';

export interface IListenable<M extends EventMap> {
  /**
   * Registers listener on given "key" event
   * @param key
   * @param listener
   */
  on<K extends EventKey<M>>(key: K, listener: EventListener<M, K>): OffFn;

  /**
   * Unregisters listener from given "key" event
   * @param key
   * @param listener
   */
  off<K extends EventKey<M>>(key: K, listener: EventListener<M, K>): void;
}