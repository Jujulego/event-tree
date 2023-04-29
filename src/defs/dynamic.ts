import { EventMap } from './event-map';
import { IObservable } from './observable';
import { IListenable } from './listenable';

// Types
export type DynamicSource =
  & Partial<IObservable<unknown>>
  & Partial<IListenable<EventMap>>;

export type Dynamify<S extends IListenable<EventMap> | IObservable<unknown>> = Pick<S, Extract<keyof S, keyof DynamicSource>>;
