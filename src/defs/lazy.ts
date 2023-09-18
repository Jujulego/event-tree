import { Emitter } from './emitter.js';
import { KeyEmitter } from './key-emitter.js';
import { EventMap } from './event-map.js';
import { Observable } from './observable.js';
import { Listenable } from './listenable.js';
import { AnySource } from './source-tree.js';

// Types
export type LazySource =
  & Partial<Emitter<unknown>>
  & Partial<KeyEmitter<EventMap>>
  & Partial<Observable<unknown>>
  & Partial<Listenable<EventMap>>;

export type Lazify<S extends AnySource> = Pick<S, Extract<keyof S, keyof LazySource>>;
