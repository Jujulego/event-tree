import { EventMap } from './event-map.js';
import { IListenable } from './listenable.js';
import { IKeyEmitter } from './key-emitter.js';

/**
 * Allows to emit and subscribe to many events
 */
export interface IMultiplexer<EmitMap extends EventMap, ListenMap extends EventMap>
  extends IKeyEmitter<EmitMap>, IListenable<ListenMap> {}
