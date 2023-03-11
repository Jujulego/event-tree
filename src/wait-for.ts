import { EventData, EventKey, EventMap, IListenable, IObservable, Key } from './defs';
import { once } from './once';

/**
 * Returns a promise that resolves when the given observable emits
 * @param obs
 */
export function waitFor<D>(obs: IObservable<D>): Promise<D>;

/**
 * Returns a promise that resolves when the given source emits the "key" event
 * @param source
 * @param key
 */
export function waitFor<M extends EventMap, K extends EventKey<M>>(source: IListenable<M>, key: K): Promise<EventData<M, K>>;

export function waitFor(...args: [obs: IObservable<unknown>] | [source: IListenable<EventMap>, key: Key]): Promise<unknown> {
  return new Promise((resolve) => once(...args, resolve));
}
