import { EventData, EventKey, EventMap, IListenable, IObservable, Key } from './defs';
import { once, OnceOpts } from './once';
import { offGroup } from './off-group';

// Types
/** @internal */
export type WaitForObservableArgs = [obs: IObservable<unknown>, opts?: OnceOpts];

/** @internal */
export type WaitForListenableArgs = [source: IListenable<EventMap>, key: Key, opts?: OnceOpts];

/** @internal */
export type WaitForArgs = WaitForObservableArgs | WaitForListenableArgs;

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

/** @internal */
export function waitFor(...args: WaitForArgs): Promise<unknown>;

export function waitFor(...args: WaitForArgs): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if ('subscribe' in args[0] && 'unsubscribe' in args[0]) {
      const [obs, opts = {}] = args as WaitForObservableArgs;
      const off = opts.off ?? offGroup();

      off.add(once(obs, resolve));
      off.add(() => reject(new Error('Unsubscribed')));
    } else {
      const [lst, key, opts = {}] = args as WaitForListenableArgs;
      const off = opts.off ?? offGroup();

      off.add(once(lst, key, resolve));
      off.add(() => reject(new Error('Unsubscribed')));
    }
  });
}
