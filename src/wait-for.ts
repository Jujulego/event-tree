import { EventData, EventKey, EventMap, IListenable, IObservable, Key, Listener } from './defs';
import { once, OnceArgs, OnceOpts } from './once';
import { OffGroup, offGroup } from './off-group';

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
    const parsed = parseArgs(args, resolve);
    const off = parsed.off ?? offGroup();

    off.add(once(...parsed.args));
    off.add(() => reject(new Error('Unsubscribed !')));
  });
}

// Utils
function parseArgs(args: WaitForArgs, resolve: Listener<unknown>): { args: OnceArgs; off?: OffGroup } {
  if ('subscribe' in args[0] && 'unsubscribe' in args[0]) {
    const [obs, opts] = args as WaitForObservableArgs;
    return { args: [obs, resolve], off: opts?.off };
  } else {
    const [lst, key, opts] = args as WaitForListenableArgs;
    return { args: [lst, key, resolve], off: opts?.off };
  }
}
