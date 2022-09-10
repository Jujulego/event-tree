import { JoinKey, Key, KeyPart, SplitKey } from './key';

// Utils
export function splitKey<K extends Key>(key: K): SplitKey<K> {
  return key.split('.') as SplitKey<K>;
}

export function joinKey<S extends readonly KeyPart[]>(key: S): JoinKey<S> {
  return key.join('.') as JoinKey<S>;
}
