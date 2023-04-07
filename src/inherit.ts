import { EmitEventMap, EventMap, IMultiplexer, InheritEventMap, Listener, ListenEventMap, SourceTree } from './defs';
import { multiplexer } from './multiplexer';
import { splitKey } from './utils';

export function inherit<PEM extends EventMap, PLM extends EventMap, T extends SourceTree>(parent: IMultiplexer<PEM, PLM>, map: T):
  IMultiplexer<InheritEventMap<PEM, EmitEventMap<T>>, InheritEventMap<PLM, ListenEventMap<T>>> {
  const child = multiplexer(map);

  return {
    emit(key: string, data: any) {
      const [part] = splitKey(key);

      if (part in map) {
        return child.emit(key, data);
      } else {
        return parent.emit(key, data);
      }
    },
    on(key: string, listener: Listener<any>) {
      const [part] = splitKey(key);

      if (part in map) {
        return child.on(key, listener);
      } else {
        return parent.on(key, listener);
      }
    },
    off(key: string, listener: Listener<any>) {
      const [part] = splitKey(key);

      if (part in map) {
        return child.off(key, listener);
      } else {
        return parent.off(key, listener);
      }
    },
    clear(key?: string) {
      if (!key) {
        child.clear();
        parent.clear();
      } else {
        const [part] = splitKey(key);

        if (part in map) {
          return child.clear(key);
        } else {
          return parent.clear(key);
        }
      }
    }
  };
}
