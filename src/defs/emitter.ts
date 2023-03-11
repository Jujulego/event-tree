export interface IEmitter<D> {
  /**
   * Emits event
   * @param data
   */
  emit(data: D): void;
}
