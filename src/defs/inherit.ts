import { Emitter } from './emitter.js';
import { InheritEventMap } from './event-map.js';
import { KeyEmitter } from './key-emitter.js';
import { Listenable } from './listenable.js';
import { Observable } from './observable.js';
import { AnySource, EmitEventMap, ListenEventMap, SourceTree } from './source-tree.js';

/**
 * Inherits events from PS (Parent Source) and adds events from T
 */
export type Inherit<PS extends AnySource, T extends SourceTree> =
  & (PS extends Emitter<infer D> ? Emitter<D> : unknown)
  & (PS extends Observable<infer D> ? Observable<D> : unknown)
  & (Listenable<PS extends Listenable<infer PLM> ? InheritEventMap<PLM, ListenEventMap<T>> : ListenEventMap<T>>)
  & (KeyEmitter<PS extends KeyEmitter<infer PEM> ? InheritEventMap<PEM, EmitEventMap<T>> : EmitEventMap<T>>);
