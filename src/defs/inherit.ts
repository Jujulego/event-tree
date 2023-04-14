import { IEmitter } from './emitter';
import { InheritEventMap } from './event-map';
import { IKeyEmitter } from './key-emitter';
import { IListenable } from './listenable';
import { IObservable } from './observable';
import { AnySource, EmitEventMap, ListenEventMap, SourceTree } from './source-tree';

// Type
export type Inherit<PS extends AnySource, T extends SourceTree> =
  & (PS extends IEmitter<infer D> ? IEmitter<D> : unknown)
  & (PS extends IObservable<infer D> ? IObservable<D> : unknown)
  & (IListenable<PS extends IListenable<infer PLM> ? InheritEventMap<PLM, ListenEventMap<T>> : ListenEventMap<T>>)
  & (IKeyEmitter<PS extends IKeyEmitter<infer PEM> ? InheritEventMap<PEM, EmitEventMap<T>> : EmitEventMap<T>>);