import { Key, KeyPart } from './key';
import { ExtractKey, PartialKey } from '../key';
import { Listener } from './utils';

// Utils
export type EventMap = Record<Key, any>;

/**
 * Add the given key part at the beginning of all map's keys
 */
export type PrependEventMapKeys<P extends KeyPart, M extends EventMap> = {
  [MK in EventKey<M> as `${P}.${MK}`]: M[MK]
}

export type AssertEventMap<M> = M extends EventMap ? M : never;

// Keys
/**
 * Extract event key type from event map type
 */
export type EventKey<M extends EventMap> = keyof M & Key;

/**
 * Extract event keys including partial keys
 */
export type EventGroupKey<M extends EventMap> = PartialKey<EventKey<M>>;

// Data
/**
 * Extract event data type matching key
 */
export type EventData<M extends EventMap, K extends EventKey<M>> = M[K];

/**
 * Extract union of event data types matching group key
 */
export type EventGroupData<M extends EventMap, GK extends EventGroupKey<M>> = EventData<M, ExtractKey<EventKey<M>, GK>>;

// Listeners
/**
 * Build listener type for given key
 */
export type EventListener<M extends EventMap, K extends EventKey<M>> = Listener<EventData<M, K>>;

/**
 * Build listener type for given group key
 */
export type EventGroupListener<M extends EventMap, GK extends EventGroupKey<M>> = Listener<EventGroupData<M, GK>>;
