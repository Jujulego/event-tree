import { AnySource, EventMap, IEmitter, IMultiplexer, Inherit, IObservable, Listener, SourceTree } from './defs/index.js';
import { multiplexer } from './multiplexer.js';
import { splitKey } from './utils/index.js';

export function inherit<S extends AnySource, T extends SourceTree>(parent: S, map: T): Inherit<S, T>;

export function inherit(parent: AnySource, map: SourceTree): AnySource {
  const child = multiplexer(map);

  function targetOf(key: string): IMultiplexer<EventMap, EventMap> {
    const [part] = splitKey(key);
    return (part in map ? child : parent) as IMultiplexer<EventMap, EventMap>;
  }

  return {
    emit(key: string, data: unknown) {
      const target = targetOf(key);
      return target.emit(key, data);
    },
    next(data: unknown) {
      return (parent as IEmitter<unknown>).next(data);
    },
    subscribe(listener: Listener<unknown>) {
      return (parent as IObservable<unknown>).subscribe(listener);
    },
    unsubscribe(listener: Listener<unknown>) {
      return (parent as IObservable<unknown>).unsubscribe(listener);
    },
    on(key: string, listener: Listener<unknown>) {
      const target = targetOf(key);
      return target.on(key, listener);
    },
    off(key: string, listener: Listener<unknown>) {
      const target = targetOf(key);
      return target.off(key, listener);
    },
    clear(key?: string) {
      if (!key) {
        child.clear();

        if ('clear' in parent) {
          parent.clear();
        }
      } else {
        const target = targetOf(key);
        return target.clear(key);
      }
    }
  };
}
