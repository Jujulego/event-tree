import { IEmitter } from './emitter';
import { IKeyEmitter } from './key-emitter';
import { EventMap } from './event-map';
import { IObservable } from './observable';
import { IListenable } from './listenable';
import { AnySource } from './source-tree';

// Types
export type LazySource =
  & Partial<IEmitter<unknown>>
  & Partial<IKeyEmitter<EventMap>>
  & Partial<IObservable<unknown>>
  & Partial<IListenable<EventMap>>;

export type Lazify<S extends AnySource> = Pick<S, Extract<keyof S, keyof LazySource>>;
