import { Key, KeyPart } from './key';
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

// Data
/**
 * Extract event data type matching key
 */
export type EventData<M extends EventMap, K extends EventKey<M> = EventKey<M>> = M[K];

// Listeners
/**
 * Build listener type for given key
 */
export type EventListener<M extends EventMap, K extends EventKey<M> = EventKey<M>> = Listener<EventData<M, K>>;
