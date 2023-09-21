import { Emitter } from './emitter.js';
import { EventData, EventKey, EventMap } from './event-map.js';
import { Listenable } from './listenable.js';
import { KeyEmitter } from './key-emitter.js';
import { Observable } from './observable.js';

// Types
export type PickableSource<M extends EventMap> = Listenable<M> | KeyEmitter<M>;

/**
 * Builds a source from "K" key picked from "S" source
 */
export type PickedSource<M extends EventMap, S extends PickableSource<M>, K extends EventKey<M>> =
  & (S extends KeyEmitter<M> ? Emitter<EventData<M, K>> : unknown)
  & (S extends Listenable<M> ? Observable<EventData<M, K>> : unknown);
