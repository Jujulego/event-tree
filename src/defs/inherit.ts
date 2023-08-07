import { IEmitter } from './emitter.js';
import { InheritEventMap } from './event-map.js';
import { IKeyEmitter } from './key-emitter.js';
import { IListenable } from './listenable.js';
import { IObservable } from './observable.js';
import { AnySource, EmitEventMap, ListenEventMap, SourceTree } from './source-tree.js';

// Type
export type Inherit<PS extends AnySource, T extends SourceTree> =
  & (PS extends IEmitter<infer D> ? IEmitter<D> : unknown)
  & (PS extends IObservable<infer D> ? IObservable<D> : unknown)
  & (IListenable<PS extends IListenable<infer PLM> ? InheritEventMap<PLM, ListenEventMap<T>> : ListenEventMap<T>>)
  & (IKeyEmitter<PS extends IKeyEmitter<infer PEM> ? InheritEventMap<PEM, EmitEventMap<T>> : EmitEventMap<T>>);