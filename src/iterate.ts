import { EventData, EventKey, EventMap, IListenable, IObservable } from './defs';
import { OnceOpts } from './once';
import { waitFor, WaitForArgs, WaitForListenableArgs, WaitForObservableArgs } from './wait-for';
import { offGroup, OffGroup } from './off-group';

/**
 * Returns an iterator over observable events
 * @param obs
 * @param opts
 */
export function iterate<D>(obs: IObservable<D>, opts?: OnceOpts): AsyncIterableIterator<D>;

/**
 * Returns an iterator over multiplexer events
 * @param source
 * @param key
 * @param opts
 */
export function iterate<M extends EventMap, K extends EventKey<M>>(source: IListenable<M>, key: K, opts?: OnceOpts): AsyncIterableIterator<EventData<M, K>>;

export function iterate(...args: WaitForArgs): AsyncIterableIterator<unknown> {
  const parsed = parseArgs(args);
  const off = parsed.off ?? offGroup();

  const abort = new Promise<unknown>((_, reject) => off.add(() => reject(new Error('Unsubscribed !'))));

  return {
    next: async () => {
      const value = await Promise.race([waitFor(...args), abort]);
      return { value };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

// Utils
function parseArgs(args: WaitForArgs): { args: WaitForArgs; off?: OffGroup } {
  if ('subscribe' in args[0] && 'unsubscribe' in args[0]) {
    const [obs, opts] = args as WaitForObservableArgs;
    return { args: [obs], off: opts?.off };
  } else {
    const [lst, key, opts] = args as WaitForListenableArgs;
    return { args: [lst, key], off: opts?.off };
  }
}
