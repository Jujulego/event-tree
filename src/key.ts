// Types
export type Key = string;
export type KeyPart = string | number;

/**
 * Extract keys by beginning
 */
export type ExtractKey<K extends Key, S extends Key> =
  K extends `${S}.${string}`
    ? K
    : S extends K
      ? S
      : never;

/**
 * Partial key
 */
export type PartialKey<K extends Key> =
  K extends `${infer P}.${infer R}`
    ? P | `${P}.${PartialKey<R>}`
    : K;

/**
 * Split key
 */
export type SplitKey<K extends Key> =
  K extends `${infer P}.${infer R}`
    ? [P, ...SplitKey<R>]
    : [K]

/**
 * Join key
 */
export type JoinKey<S extends readonly KeyPart[]> =
  S extends readonly [infer P extends KeyPart]
    ? P
    : S extends readonly [infer P extends KeyPart, ...infer R extends KeyPart[]]
      ? `${P}.${JoinKey<R>}`
      : never;
