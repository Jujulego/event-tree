/**
 * Objects emitting events
 */
export interface Emitter<D> {
  /**
   * Emits event
   * @param data
   */
  next(data: D): void;
}
