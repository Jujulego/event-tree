import { ExtractKey, Key, PartialKey } from './key';

// Types
export type EventMap = Record<Key, unknown>;

/**
 * Extract event key type from event map type
 */
export type EventKey<M extends EventMap> = keyof M & Key;

export type EventGroupKey<M extends EventMap> = PartialKey<EventKey<M>>;

/**
 * Extract event data type from event map type
 */
export type EventData<M extends EventMap, K extends EventKey<M>> = M[K];

export type EventGroupData<M extends EventMap, GK extends EventGroupKey<M>> = EventData<M, ExtractKey<EventKey<M>, GK>>;

/**
 * Holds data about an event
 */
export interface EventMetadata {
  key: Key;
  origin: unknown;
}

/**
 * Function used to unsubscribe a listener
 */
export type EventListener<M extends EventMap, K extends EventKey<M>> =
  (data: EventData<M, K>, metadata: EventMetadata) => void;

export type EventGroupListener<M extends EventMap, GK extends EventGroupKey<M>> =
  (data: EventGroupData<M, GK>, metadata: EventMetadata) => void;

/**
 * Function used to unsubscribe a listener
 */
export type EventUnsubscribe = () => void;

/**
 * Object managing subscription to events
 */
export interface EventObservable<M extends EventMap> {
  /**
   * Register a listener on an event or a group of event
   */
  subscribe<GK extends EventGroupKey<M>>(
    key: GK,
    listener: EventGroupListener<M, GK>
  ): EventUnsubscribe;
}

/**
 * Object emitting events
 */
export interface EventOrigin<M extends EventMap> extends EventObservable<M> {
  /**
   * Emits a new event
   */
  emit<K extends EventKey<M>>(
    key: K,
    data: EventData<M, K>
  ): void;
}
