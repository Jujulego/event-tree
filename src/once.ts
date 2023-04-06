import { EventData, EventKey, EventMap, IListenable, IObservable, Key, Listener, OffFn } from './defs';
import { OffGroup } from './off-group';

// Types
export interface OnceOpts {
  off?: OffGroup;
}

/**
 * Returns a promise that resolves when the given observable emits
 * @param obs
 * @param listener
 * @param opts
 */
export function once<D>(obs: IObservable<D>, listener: Listener<D>, opts?: OnceOpts): OffFn;

/**
 * Returns a promise that resolves when the given source emits the "key" event
 * @param source
 * @param key
 * @param listener
 * @param opts
 */
export function once<M extends EventMap, K extends EventKey<M>>(source: IListenable<M>, key: K, listener: Listener<EventData<M, K>>, opts?: OnceOpts): OffFn;

/** @internal */
export function once(...args: [obs: IObservable<unknown>, listener: Listener<unknown>, opts?: OnceOpts] | [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>, opts?: OnceOpts]): OffFn;

export function once(...args: [obs: IObservable<unknown>, listener: Listener<unknown>, opts?: OnceOpts] | [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>, opts?: OnceOpts]): OffFn {
  let off: OffFn;

  if (typeof args[1] === 'function') {
    const [obs, listener, opts = {}] = args as [obs: IObservable<unknown>, listener: Listener<unknown>, opts?: OnceOpts];

    off = keepOrJoin(opts.off, obs.subscribe((data) => {
      off();
      listener(data);
    }));
  } else {
    const [source, key, listener, opts = {}] = args as [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>, opts?: OnceOpts];

    off = keepOrJoin(opts.off, source.on(key, (data) => {
      off();
      listener(data);
    }));
  }

  return off;
}

// Utils
function keepOrJoin(group: OffGroup | undefined, off: OffFn): OffFn {
  if (group) {
    group.add(off);
    return group;
  } else {
    return off;
  }
}
