import { Key, KeyPart } from '../defs/index.js';

// Utils
export function splitKey(key: Key): [KeyPart, Key] {
  const idx = key.indexOf('.');

  if (idx === -1) {
    return [key, ''];
  } else {
    return [key.slice(0, idx), key.slice(idx + 1)];
  }
}
