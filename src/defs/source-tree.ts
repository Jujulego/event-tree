import { IGroup } from './group';
import { KeyPart } from './key';
import { IMultiplexer } from './multiplexer';
import { ISource } from './source';
import { AssertEventMap, EventData, EventKey, EventMap, PrependEventMapKeys } from './event-map';
import { MapValueIntersection } from './utils';

// Utils
export type SourceTree = Record<KeyPart, ISource<unknown> | IMultiplexer<EventMap, EventMap> | IGroup<EventMap, EventMap>>;

// Event Maps
export type EmitEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]: T[K] extends IMultiplexer<infer EM, EventMap>
    ? PrependEventMapKeys<K, EM>
    : T[K] extends ISource<infer D>
      ? Record<K, D>
      : never
}>>

export type ListenEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]: T[K] extends IGroup<EventMap, infer GLM>
    ? PrependEventMapKeys<K, GLM> & Record<K, EventData<GLM>>
    : T[K] extends IMultiplexer<EventMap, infer MLM>
      ? PrependEventMapKeys<K, MLM>
      : T[K] extends ISource<infer D>
        ? Record<K, D>
        : never
}>>
