import { EventMap } from './event-map.js';
import { Observable } from './observable.js';
import { Listenable } from './listenable.js';

// Types
export type DynamicSource =
  & Partial<Observable<unknown>>
  & Partial<Listenable<EventMap>>;

export type Dynamify<S extends Listenable<EventMap> | Observable<unknown>> = Pick<S, Extract<keyof S, keyof DynamicSource>>;
