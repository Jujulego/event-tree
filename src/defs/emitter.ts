/**
 * Objects emitting events
 */
export interface Emitter<D = unknown> {
  /**
   * Emits event
   * @param data
   */
  next(data: D): void;
}

// Utils
export type EmitValue<E extends Emitter> = E extends Emitter<infer D> ? D : never;