import { Observable } from './observable.js';
import { Listenable } from './listenable.js';

// Types
export type DynamicSource =
  & Partial<Observable>
  & Partial<Listenable>;

export type Dynamify<S extends Listenable | Observable> = Pick<S, Extract<keyof S, keyof DynamicSource>>;
