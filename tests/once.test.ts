import { multiplexer, Multiplexer, once, source, Source } from '../src';

// Setup
let src: Source<number>;
let mlt: Multiplexer<{ src: Source<number> }>;

beforeEach(() => {
  src = source();
  mlt = multiplexer({ src });
});

describe('once', () => {
  it('should call listener and remove it (source)', () => {
    const listener = jest.fn();
    once(src, listener);

    src.emit(1);
    src.emit(1);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should call listener and remove it (multiplexer)', () => {
    const listener = jest.fn();
    once(mlt, 'src', listener);

    mlt.emit('src', 1);
    mlt.emit('src', 1);

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
