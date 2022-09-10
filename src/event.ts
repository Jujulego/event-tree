import { ExtractKey, Key, PartialKey } from './key';

// Types
export type EventMap = Record<Key, any>;

/**
 * Extract event key type from event map type
 */
export type EventKey<M extends EventMap> = keyof M & Key;

/**
 * Extract event data type from event map type
 */
export type EventData<M extends EventMap, K extends EventKey<M>> = M[K];

/**
 * Holds data about an event
 */
export interface EventMetadata<M extends EventMap, K extends EventKey<M>> {
  key: K;
  origin: EventOrigin<M>;
}

/**
 * Function used to unsubscribe a listener
 */
export type EventListener<M extends EventMap, K extends EventKey<M>> =
  (data: EventData<M, K>, metadata: EventMetadata<M, K>) => void;

/**
 * Function used to unsubscribe a listener
 */
export type EventUnsubscribe = () => void;

/**
 * Object allowing subscription to events
 */
export interface EventObservable<M extends EventMap> {
  /**
   * Register a listener on an event or a group of event
   */
  subscribe<PK extends PartialKey<EventKey<M>>>(
    key: PK,
    listener: EventListener<M, ExtractKey<EventKey<M>, PK>>
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
