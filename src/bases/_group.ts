import { AnyEventMap, IGroup, IMultiplexer, ISource, Key } from '../defs';

/** @internal */
export function _group(mlt: IMultiplexer<AnyEventMap, AnyEventMap>, src: ISource<any>): IGroup<AnyEventMap, AnyEventMap> {
  return {
    emit(key: Key, data: any) {
      mlt.emit(key, data);
      src.emit(data);
    },

    on: mlt.on,
    off: mlt.off,

    subscribe: src.subscribe,
    unsubscribe: src.unsubscribe,

    clear(key?: Key) {
      mlt.clear(key);

      if (!key) {
        src.clear();
      }
    }
  };
}
