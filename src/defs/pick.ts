import { Emitter } from './emitter.js';
import { EventData, EventKey, EventMap } from './event-map.js';
import { Listenable } from './listenable.js';
import { KeyEmitter } from './key-emitter.js';
import { Observable } from './observable.js';

/**
 * Event sources that can be picked
 */
export type PickableSource<M extends EventMap = EventMap> = Listenable<M> | KeyEmitter<M>;

/**
 * Extracts keys pickable from given source
 */
export type PickableKey<S extends PickableSource> =
  | (S extends KeyEmitter<infer M> ? EventKey<M> : never)
  | (S extends Listenable<infer M> ? EventKey<M> : never);

/**
 * Builds a source from "K" key picked from "S" source
 */
export type PickedSource<S extends PickableSource, K extends PickableKey<S>> =
  & (S extends KeyEmitter<infer M> ? Emitter<EventData<M, K>> : unknown)
  & (S extends Listenable<infer M> ? Observable<EventData<M, K>> : unknown);
