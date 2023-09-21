import {
  EventData,
  EventKey,
  EventMap,
  KeyEmitter, Listenable,
  Listener,
  OffFn,
  PickableSource,
  PickedSource
} from './defs/index.js';

// Utils
function isEmitter<M extends EventMap>(src: PickableSource<M>): src is KeyEmitter<M> {
  return 'emit' in src;
}

function isListenable<M extends EventMap>(src: PickableSource<M>): src is Listenable<M> {
  return 'on' in src;
}

// Builder
export function pick$<M extends EventMap, S extends PickableSource<M>, K extends EventKey<M>>(src: S, key: K): PickedSource<M, S, K> {
  let result = {};

  if (isEmitter(src)) {
    result = Object.assign(result, {
      next: (data: EventData<M, K>) => src.emit(key, data),
    });
  }

  if (isListenable(src)) {
    result = Object.assign(result, {
      subscribe: (listener: Listener<EventData<M, K>>): OffFn => src.on(key, listener),
      unsubscribe: (listener: Listener<EventData<M, K>>) => src.off(key, listener),
      clear: () => src.clear(key),
    });
  }

  return result as PickedSource<M, S, K>;
}
