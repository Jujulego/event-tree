import { EventMap } from './event-map.js';
import { IObservable } from './observable.js';
import { IListenable } from './listenable.js';

// Types
export type DynamicSource =
  & Partial<IObservable<unknown>>
  & Partial<IListenable<EventMap>>;

export type Dynamify<S extends IListenable<EventMap> | IObservable<unknown>> = Pick<S, Extract<keyof S, keyof DynamicSource>>;
