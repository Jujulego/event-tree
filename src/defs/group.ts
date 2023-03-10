import { EventData, EventMap } from './event-map';
import { IObservable } from './observable';
import { IMultiplexer } from './multiplexer';

export interface IGroup<EmitMap extends EventMap, ListenMap extends EventMap>
  extends IObservable<EventData<ListenMap>>, IMultiplexer<EmitMap, ListenMap> {}
