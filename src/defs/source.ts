import { IEmitter } from './emitter.js';
import { IObservable } from './observable.js';

/**
 * Simplest event source
 */
export interface ISource<D> extends IObservable<D>, IEmitter<D> {}
