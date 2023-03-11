import { EventData, EventKey, EventMap, IListenable, IObservable, Key } from './defs';
import { waitFor } from './wait-for';

/**
 * Returns an iterator over observable events
 * @param obs
 */
export function iterate<D>(obs: IObservable<D>): AsyncIterator<D, void>;

/**
 * Returns an iterator over multiplexer events
 * @param source
 * @param key
 */
export function iterate<M extends EventMap, K extends EventKey<M>>(source: IListenable<M>, key: K): AsyncIterator<EventData<M, K>, void>;

export function iterate(...args: [obs: IObservable<unknown>] | [source: IListenable<EventMap>, key: Key]): AsyncIterator<unknown, void> {
  return {
    next: () => waitFor(...args).then((value) => ({ value })),
  };
}
