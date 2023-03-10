import { Listener, Source, source } from '../src';

// Setup
let src: Source<number>;

beforeEach(() => {
  src = source();
});

// Tests
describe('source', () => {
  it('should call listeners when an event is emitted', () => {
    const listener: Listener<number> = jest.fn();

    src.subscribe(listener);
    src.emit(1);

    expect(listener).toHaveBeenCalledWith(1);
  });

  it('should not call removed listeners (off method)', () => {
    const listener: Listener<number> = jest.fn();

    src.subscribe(listener);
    src.unsubscribe(listener);
    src.emit(1);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call removed listeners (returned off)', () => {
    const listener: Listener<number> = jest.fn();

    const off = src.subscribe(listener);
    off();

    src.emit(1);

    expect(listener).not.toHaveBeenCalled();
  });
});
