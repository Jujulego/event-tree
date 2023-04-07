import { EmitEventMap, EventMap, IMultiplexer, InheritEventMap, Listener, ListenEventMap, SourceTree } from './defs';
import { multiplexer } from './multiplexer';
import { splitKey } from './utils';

export function inherit<PEM extends EventMap, PLM extends EventMap, T extends SourceTree>(parent: IMultiplexer<PEM, PLM>, map: T):
  IMultiplexer<InheritEventMap<PEM, EmitEventMap<T>>, InheritEventMap<PLM, ListenEventMap<T>>> {
  const child = multiplexer(map);

  function targetOf(key: string): IMultiplexer<EventMap, EventMap> {
    const [part] = splitKey(key);
    return part in map ? child : parent;
  }

  return {
    emit(key: string, data: unknown) {
      const target = targetOf(key);
      return target.emit(key, data);
    },
    on(key: string, listener: Listener<any>) {
      const target = targetOf(key);
      return target.on(key, listener);
    },
    off(key: string, listener: Listener<any>) {
      const target = targetOf(key);
      return target.off(key, listener);
    },
    clear(key?: string) {
      if (!key) {
        child.clear();
        parent.clear();
      } else {
        const target = targetOf(key);
        return target.clear(key);
      }
    }
  };
}
