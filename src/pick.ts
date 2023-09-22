import {
  KeyEmitter, Listenable,
  Listener,
  OffFn, PickableKey,
  PickableSource,
  PickedSource
} from './defs/index.js';

// Utils
function isEmitter(src: PickableSource): src is KeyEmitter {
  return 'emit' in src;
}

function isListenable(src: PickableSource): src is Listenable {
  return 'on' in src;
}

// Builder
export function pick$<S extends PickableSource, K extends PickableKey<S>>(src: S, key: K): PickedSource<S, K>;

export function pick$(src: PickableSource, key: string) {
  let result = {};

  if (isEmitter(src)) {
    result = Object.assign(result, {
      next: (data: unknown) => src.emit(key, data),
    });
  }

  if (isListenable(src)) {
    result = Object.assign(result, {
      subscribe: (listener: Listener<unknown>): OffFn => src.on(key, listener),
      unsubscribe: (listener: Listener<unknown>) => src.off(key, listener),
      clear: () => src.clear(key),
    });
  }

  return result;
}
