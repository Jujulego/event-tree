import { EventData, EventKey, EventMap, IListenable, IObservable, Key, Listener, OffFn } from './defs';

/**
 * Returns a promise that resolves when the given observable emits
 * @param obs
 * @param listener
 */
export function once<D>(obs: IObservable<D>, listener: Listener<D>): OffFn;

/**
 * Returns a promise that resolves when the given source emits the "key" event
 * @param source
 * @param key
 * @param listener
 */
export function once<M extends EventMap, K extends EventKey<M>>(source: IListenable<M>, key: K, listener: Listener<EventData<M, K>>): OffFn;

/** @internal */
export function once(...args: [obs: IObservable<unknown>, listener: Listener<unknown>] | [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>]): OffFn;

export function once(...args: [obs: IObservable<unknown>, listener: Listener<unknown>] | [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>]): OffFn {
  let off: OffFn;

  if (args.length === 2) {
    const [obs, listener] = args;

    off = obs.subscribe((data) => {
      off();
      listener(data);
    });
  } else {
    const [source, key, listener] = args;

    off = source.on(key, (data) => {
      off();
      listener(data);
    });
  }

  return off;
}
