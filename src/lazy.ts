import { EventMap, IListenable, IObservable } from './defs';

// Types
type AnyEmitter = IObservable<unknown> | IListenable<EventMap>;
type LazyEmitter = Partial<IObservable<unknown>> & Partial<IListenable<EventMap>>;

export function lazy<D, M extends EventMap>(getter: () => IObservable<D> & IListenable<M>): IObservable<D> & IListenable<M>;
export function lazy<M extends EventMap>(getter: () => IListenable<M>): IListenable<M>;
export function lazy<D>(getter: () => IObservable<D>): IObservable<D>;

export function lazy(getter: () => AnyEmitter): LazyEmitter {
  let _emt: AnyEmitter | null = null;

  function load(): AnyEmitter {
    return _emt ??= getter();
  }

  return {
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
  };
}

// Utils
function replaceProp(obj: LazyEmitter, prop: keyof LazyEmitter, emt: AnyEmitter): void {
  delete obj[prop];

  if (prop in emt) {
    obj[prop] = (emt as LazyEmitter)[prop] as any;
  }
}
