import { Observable } from './observable.js';

/**
 * Builds observable union of observed values of All
 */
export type MergeObservable<All extends Observable[]> = Observable<MergeObservedValue<All>>;

/**
 * Builds union of observed values of All
 */
export type MergeObservedValue<All extends Observable[]> = All extends [Observable<infer D>]
  ? D
  : All extends [Observable<infer D>, ...infer R extends Observable[]]
    ? D | MergeObservedValue<R>
    : never;
