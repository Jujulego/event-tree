import { Key, KeyPart, Listener } from './utils';

// Utils
export type EventMap = Record<Key, unknown>;

/** @deprecated Use EventMap instead */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type AnyEventMap = Record<Key, any>;

/**
 * Add the given key part at the beginning of all map's keys
 */
export type PrependEventMapKeys<P extends KeyPart, M extends EventMap> = {
  [MK in EventKey<M> as `${P}.${MK}`]: M[MK]
}

export type AssertEventMap<M> = M extends EventMap ? M : never;

/**
 * Add not overridden props of parent map to child map
 */
export type InheritEventMap<PM extends EventMap, M extends EventMap> = M & Pick<PM, Exclude<EventKey<PM>, EventKey<M>>>;

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
