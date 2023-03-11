import { multiplexer, Multiplexer, source, Source, iterate } from '../src';

// Setup
let src: Source<number>;
let mlt: Multiplexer<{ src: Source<number> }>;

beforeEach(() => {
  src = source();
  mlt = multiplexer({ src });
});

describe('iterate', () => {
  it('should iterate over source emits', async () => {
    const it = iterate(src);

    setTimeout(() => src.emit(1), 0);
    await expect(it.next()).resolves.toEqual({ value: 1 });

    setTimeout(() => src.emit(2), 0);
    await expect(it.next()).resolves.toEqual({ value: 2 });
  });

  it('should abort using controller (source)', async () => {
    const ctrl = new AbortController();

    const it = iterate(src, { signal: ctrl.signal });

    setTimeout(() => ctrl.abort(new Error('Aborted !')), 0);
    await expect(it.next()).rejects.toEqual(new Error('Aborted !'));
  });

  it('should iterate over multiplexer emits', async () => {
    const it = iterate(mlt, 'src');

    setTimeout(() => mlt.emit('src', 1), 0);
    await expect(it.next()).resolves.toEqual({ value: 1 });

    setTimeout(() => mlt.emit('src', 2), 0);
    await expect(it.next()).resolves.toEqual({ value: 2 });
  });

  it('should abort using controller (multiplexer)', async () => {
    const ctrl = new AbortController();

    const it = iterate(mlt, 'src', { signal: ctrl.signal });

    setTimeout(() => ctrl.abort(new Error('Aborted !')), 0);
    await expect(it.next()).rejects.toEqual(new Error('Aborted !'));
  });
});
