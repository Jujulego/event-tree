import { IEmitter } from './emitter.js';
import { AssertEventMap, EventKey, EventMap, PrependEventMapKeys } from './event-map.js';
import { IKeyEmitter } from './key-emitter.js';
import { IListenable } from './listenable.js';
import { IObservable } from './observable.js';
import { KeyPart, MapValueIntersection } from './utils.js';

// Utils
export type AnySource = IEmitter<unknown> | IKeyEmitter<EventMap> | IObservable<unknown> | IListenable<EventMap>;
export type SourceTree = Record<KeyPart, AnySource>;

type _EmitEventRecord<K extends KeyPart, S> =
  & (S extends IKeyEmitter<infer EM> ? PrependEventMapKeys<K, EM> : unknown)
  & (S extends IEmitter<infer D> ? Record<K, D> : unknown);

type _ListenEventRecord<K extends KeyPart, S extends AnySource> =
  & (S extends IListenable<infer LM> ? PrependEventMapKeys<K, LM> : unknown)
  & (S extends IObservable<infer D> ? Record<K, D> : unknown);

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
