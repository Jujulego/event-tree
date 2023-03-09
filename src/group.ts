import { IGroup } from './defs/group';
import { EventKey, EventMap, AssertEventMap, PrependEventMapKeys } from './defs/event-map';
import { Listener, MapValueIntersection, OffFn } from './defs/utils';
import { KeyPart } from './defs/key';
import { ISource } from './defs/source';
import { source } from './source';

// Types
export type SourceMap = Record<KeyPart, ISource<any> | IGroup<any>>;

export type EventMapOfSources<SM extends SourceMap> = {
  [K in EventKey<SM>]: SM[K] extends ISource<infer D>
    ? Record<K, D>
    : SM[K] extends IGroup<infer M>
      ? PrependEventMapKeys<K, M>
      : never
}

export type GroupEventMap<SM extends SourceMap> = AssertEventMap<MapValueIntersection<EventMapOfSources<SM>>>;

export interface Group<M extends EventMap> extends IGroup<M> {
  // Attributes
  sources: Map<KeyPart, ISource<unknown> | IGroup<EventMap>>;
  listeners: Set<Listener<M[keyof M]>>;
}

// Utils
export function group<SM extends SourceMap>(map: SM): Group<GroupEventMap<SM>> {
  const sources = new Map<KeyPart, any>(Object.entries(map));
  const inner = source();

  function getSource(key: KeyPart) {
    const src = sources.get(key);

    if (!src) {
      throw new Error(`source ${key} not found`);
    }

    return src;
  }

  function splitKey(key: string): [string, string] {
    const idx = key.indexOf('.');

    if (idx === -1) {
      return [key, ''];
    } else {
      return [key.slice(0, idx), key.slice(idx + 1)];
    }
  }

  return {
    sources,
    listeners: inner.listeners,

    emit(key: string, data: any) {
      const [part, subkey] = splitKey(key);
      const src = getSource(part);

      if (subkey) {
        src.emit(subkey, data);
      } else {
        src.emit(part, data);
      }

      inner.emit(data);
    },

    on(...args: [Listener<any>] | [string, Listener<any>]): OffFn {
      if (args.length === 1) {
        return inner.on(args[0]);
      } else {
        const [key, listener] = args;
        const [part, subkey] = splitKey(key);
        const src = getSource(part);

        if (subkey) {
          return src.on(subkey, listener);
        } else {
          return src.on(listener);
        }
      }
    },

    off(...args: [Listener<any>] | [string, Listener<any>]): void {
      if (args.length === 1) {
        inner.off(args[0]);
      } else {
        const [key, listener] = args;
        const [part, subkey] = splitKey(key);
        const src = getSource(part);

        if (subkey) {
          src.off(subkey, listener);
        } else {
          src.off(listener);
        }
      }
    }
  };
}
