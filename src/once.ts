import { EventData, EventKey, EventMap, IListenable, IObservable, Key, Listener, OffFn } from './defs';
import { OffGroup } from './off-group';

// Types
export interface OnceOpts {
  off?: OffGroup;
}

/** @internal */
export type OnceObservableArgs = [obs: IObservable<unknown>, listener: Listener<unknown>, opts?: OnceOpts];

/** @internal */
export type OnceListenableArgs = [source: IListenable<EventMap>, key: Key, listener: Listener<unknown>, opts?: OnceOpts];

/** @internal */
export type OnceArgs = OnceObservableArgs | OnceListenableArgs;

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
export function once(...args: OnceArgs): OffFn;

export function once(...args: OnceArgs): OffFn {
  let off: OffFn;

  if (typeof args[1] === 'function') {
    const [obs, listener, opts = {}] = args as OnceObservableArgs;

    off = keepOrJoin(opts.off, obs.subscribe((data) => {
      off();
      listener(data);
    }));
  } else {
    const [lst, key, listener, opts = {}] = args as OnceListenableArgs;

    off = keepOrJoin(opts.off, lst.on(key, (data) => {
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
