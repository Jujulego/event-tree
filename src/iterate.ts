import { EventData, EventKey, EventMap, IListenable, IObservable, Key } from './defs';
import { waitFor, WaitForArgs } from './wait-for';

// Types
export interface IterateOptions {
  signal?: AbortSignal;
}

/** @internal */
export type IterateArgs =
  | [obs: IObservable<unknown>, opts?: IterateOptions]
  | [source: IListenable<EventMap>, key: Key, opts?: IterateOptions]

/** @internal */
function parseArgs(args: IterateArgs): { waitFor: WaitForArgs, opts: IterateOptions } {
  if (args.length === 1) {
    // Observable without options
    return {
      waitFor: args as WaitForArgs,
      opts: {}
    };
  }

  if (args.length === 3) {
    // Multiplexer with options
    return {
      waitFor: args.slice(0, 2) as WaitForArgs,
      opts: args[2] ?? {},
    };
  }

  if (typeof args[1] === 'string') {
    // Multiplexer without options
    return {
      waitFor: args as WaitForArgs,
      opts: {},
    };
  } else {
    // Observable with options
    return {
      waitFor: args.slice(0, 1) as WaitForArgs,
      opts: args[1] ?? {},
    };
  }
}

/**
 * Returns an iterator over observable events
 * @param obs
 * @param opts
 */
export function iterate<D>(obs: IObservable<D>, opts?: IterateOptions): AsyncIterableIterator<D>;

/**
 * Returns an iterator over multiplexer events
 * @param source
 * @param key
 * @param opts
 */
export function iterate<M extends EventMap, K extends EventKey<M>>(source: IListenable<M>, key: K, opts?: IterateOptions): AsyncIterableIterator<EventData<M, K>>;

export function iterate(...args: IterateArgs): AsyncIterableIterator<unknown> {
  const parsed = parseArgs(args);

  const abort = new Promise<unknown>((_, reject) => {
    parsed.opts.signal?.addEventListener('abort', function () { reject(this.reason); }, { once: true });
  });

  return {
    next: async () => {
      const value = await Promise.race([waitFor(...parsed.waitFor), abort]);
      return { value };
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}