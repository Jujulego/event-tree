export interface IEmitter<D> {
  /**
   * Emits event
   * @param data
   */
  next(data: D): void;
}
