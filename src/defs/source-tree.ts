import { IGroup } from './group';
import { KeyPart } from './key';
import { IMultiplexer } from './multiplexer';
import { ISource } from './source';
import { AssertEventMap, EventData, EventKey, PrependEventMapKeys } from './event-map';
import { MapValueIntersection } from './utils';

// Utils
export type SourceTree = Record<KeyPart, ISource<any> | IMultiplexer<any, any> | IGroup<any, any>>;

// Event Maps
export type EmitEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]: T[K] extends IMultiplexer<infer EM, any>
    ? PrependEventMapKeys<K, EM>
    : T[K] extends ISource<infer D>
      ? Record<K, D>
      : never
}>>

export type ListenEventMap<T extends SourceTree> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<T>]: T[K] extends IGroup<any, infer GLM>
    ? PrependEventMapKeys<K, GLM> & Record<K, EventData<GLM>>
    : T[K] extends IMultiplexer<any, infer MLM>
      ? PrependEventMapKeys<K, MLM>
      : T[K] extends ISource<infer D>
        ? Record<K, D>
        : never
}>>
