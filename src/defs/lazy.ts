import { IEmitter } from './emitter.js';
import { IKeyEmitter } from './key-emitter.js';
import { EventMap } from './event-map.js';
import { IObservable } from './observable.js';
import { IListenable } from './listenable.js';
import { AnySource } from './source-tree.js';

// Types
export type LazySource =
  & Partial<IEmitter<unknown>>
  & Partial<IKeyEmitter<EventMap>>
  & Partial<IObservable<unknown>>
  & Partial<IListenable<EventMap>>;

export type Lazify<S extends AnySource> = Pick<S, Extract<keyof S, keyof LazySource>>;
