import { EventMap } from './event-map.js';
import { Listenable } from './listenable.js';
import { KeyEmitter } from './key-emitter.js';

/**
 * Allows to emit and subscribe to many events
 */
export interface Multiplexer<EmitMap extends EventMap, ListenMap extends EventMap>
  extends KeyEmitter<EmitMap>, Listenable<ListenMap> {}
