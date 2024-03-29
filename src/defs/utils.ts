// Aliases
export type Key = string;
export type KeyPart = string | number;

// Functions
export type Listener<D = unknown> = (data: D) => void;
export type OffFn = () => void;

// Utils
/**
 * Transforms a union into an intersection:
 * UnionToIntersection<'a' | 'b'> => 'a' & 'b'
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Build type as intersection of all map's value types
 * MapValueIntersection<{ a: 'a', b: 'b' }> => 'a' & 'b'
 */
export type MapValueIntersection<M> = UnionToIntersection<M[keyof M]>;
