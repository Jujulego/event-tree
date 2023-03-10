import { IEmitter } from './emitter';
import { IListenable } from './listenable';

/**
 * Simplest event source
 */
export interface ISource<D> extends IEmitter<D>, IListenable<D> {}
