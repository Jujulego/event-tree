import { IEmitter } from './emitter';
import { IObservable } from './observable';

/**
 * Simplest event source
 */
export interface ISource<D> extends IEmitter<D>, IObservable<D> {}
