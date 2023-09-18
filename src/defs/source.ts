import { Emitter } from './emitter.js';
import { Observable } from './observable.js';

/**
 * Simplest event source
 */
export interface Source<D> extends Observable<D>, Emitter<D> {}
