import { EventMap } from './event-map';
import { IListenable } from './listenable';
import { IKeyEmitter } from './key-emitter';

/**
 * Allows to emit and subscribe to many events
 */
export interface IMultiplexer<EmitMap extends EventMap, ListenMap extends EventMap>
  extends IKeyEmitter<EmitMap>, IListenable<ListenMap> {}
