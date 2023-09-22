import { Emitter } from './emitter.js';
import { AssertEventMap, EventKey, PrependEventMapKeys } from './event-map.js';
import { KeyEmitter } from './key-emitter.js';
import { Listenable } from './listenable.js';
import { Observable } from './observable.js';
import { KeyPart, MapValueIntersection } from './utils.js';

// Utils
export type AnySource = Emitter | KeyEmitter | Observable | Listenable;

export type SourceTree = Record<KeyPart, AnySource>;

type _EmitEventRecord<K extends KeyPart, S> =
  & (S extends KeyEmitter<infer EM> ? PrependEventMapKeys<K, EM> : unknown)
  & (S extends Emitter<infer D> ? Record<K, D> : unknown);

type _ListenEventRecord<K extends KeyPart, S extends AnySource> =
  & (S extends Listenable<infer LM> ? PrependEventMapKeys<K, LM> : unknown)
  & (S extends Observable<infer D> ? Record<K, D> : unknown);

// Event Maps
export type EmitEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]: _EmitEventRecord<K, T[K]>;
}>>;

export type ListenEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]: _ListenEventRecord<K, T[K]>;
}>>;

// Event Records
export type EmitEventRecord<K extends KeyPart, S extends AnySource> = EmitEventMap<Record<K, S>>;

export type ListenEventRecord<K extends KeyPart, S extends AnySource> = ListenEventMap<Record<K, S>>;
