import { EventData, EventKey, EventMap, IListenable, IObservable, Key, Listener } from './defs';
import { offGroup, OffGroup } from './off-group';

/**
 * Returns a promise that resolves when the given observable emits
 * @param obs
 * @param listener
 */
export function once<D>(obs: IObservable<D>, listener: Listener<D>): OffGroup;

/**
 * Returns a promise that resolves when the given source emits the "key" event
 * @param source
 * @param key
 * @param listener
 */
export function once<M extends EventMap, K extends EventKey<M>>(source: IListenable<M>, key: K, listener: Listener<EventData<M, K>>): OffGroup;

/** @internal */
export function once(...args: [obs: IObservable<unknown>, listener: Listener<unknown>] | [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>]): OffGroup;

export function once(...args: [obs: IObservable<unknown>, listener: Listener<unknown>] | [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>]): OffGroup {
  const off = offGroup();

  if (args.length === 2) {
    const [obs, listener] = args;

    off.add(
      obs.subscribe((data) => {
        off();
        listener(data);
      })
    );
  } else {
    const [source, key, listener] = args;

    off.add(
      source.on(key, (data) => {
        off();
        listener(data);
      })
    );
  }

  return off;
}
