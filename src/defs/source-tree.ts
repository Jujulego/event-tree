import { IEmitter } from './emitter';
import { AssertEventMap, EventKey, EventMap, PrependEventMapKeys } from './event-map';
import { IKeyEmitter } from './key-emitter';
import { IListenable } from './listenable';
import { IObservable } from './observable';
import { KeyPart, MapValueIntersection } from './utils';

// Utils
export type AnySource = IEmitter<unknown> | IKeyEmitter<EventMap> | IObservable<unknown> | IListenable<EventMap>;
export type SourceTree = Record<KeyPart, AnySource>;

// Event Maps
export type EmitEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]:
    & (T[K] extends IKeyEmitter<infer EM> ? PrependEventMapKeys<K, EM> : unknown)
    & (T[K] extends IEmitter<infer D> ? Record<K, D> : unknown)
}>>

export type ListenEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]:
    & (T[K] extends IListenable<infer LM> ? PrependEventMapKeys<K, LM> : unknown)
    & (T[K] extends IObservable<infer D> ? Record<K, D> : unknown)
}>>
