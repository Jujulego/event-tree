import { AnySource, Lazify, LazySource } from './defs/index.js';

/**
 * Defines a lazy source.
 * A lazy source will only be initialized on first access to one of it's source/emitter attribute.
 *
 * @param cb
 */
export function lazy$<S extends AnySource>(cb: () => S): Lazify<S>;

export function lazy$(cb: () => AnySource): LazySource {
  let _src: AnySource | null = null;

  function load(): AnySource {
    _src ??= cb();
    return _src;
  }

  return {
    get emit() {
      replaceProp(this, 'emit', load());
      return this.emit;
    },
    get next() {
      replaceProp(this, 'next', load());
      return this.next;
    },
    get on() {
      replaceProp(this, 'on', load());
      return this.on;
    },
    get off() {
      replaceProp(this, 'off', load());
      return this.off;
    },
    get subscribe() {
      replaceProp(this, 'subscribe', load());
      return this.subscribe;
    },
    get unsubscribe() {
      replaceProp(this, 'unsubscribe', load());
      return this.unsubscribe;
    },
    get clear() {
      replaceProp(this, 'clear', load());
      return this.clear;
    },
  } as LazySource;
}

/** @deprecated */
export const lazy = lazy$;

// Utils
function replaceProp<P extends keyof LazySource>(obj: LazySource, prop: P, emt: AnySource): void {
  delete obj[prop];

  if (prop in emt) {
    obj[prop] = (emt as LazySource)[prop];
  }
}
