import { multiplexer, Multiplexer, source, Source, waitFor } from '../src';

// Setup
let src: Source<number>;
let mlt: Multiplexer<{ src: Source<number> }>;

beforeEach(() => {
  src = source();
  mlt = multiplexer({ src });
});

describe('waitFor', () => {
  it('should resolve when source emits', async () => {
    setTimeout(() => src.emit(1), 0);

    await expect(waitFor(src)).resolves.toBe(1);
  });

  it('should resolve when multiplexer emits', async () => {
    setTimeout(() => mlt.emit('src', 1), 0);

    await expect(waitFor(mlt, 'src')).resolves.toBe(1);
  });
});