import { multiplexer, Multiplexer, source, Source, iterate, offGroup } from '../src';

// Setup
let src: Source<number>;
let mlt: Multiplexer<{ src: Source<number> }>;

beforeEach(() => {
  src = source();
  mlt = multiplexer({ src });
});

describe('iterate', () => {
  describe('on an observable', () => {
    it('should iterate over observable emits', async () => {
      const it = iterate(src);

      setTimeout(() => src.emit(1), 0);
      await expect(it.next()).resolves.toEqual({ value: 1 });

      setTimeout(() => src.emit(2), 0);
      await expect(it.next()).resolves.toEqual({ value: 2 });
    });

    it('should abort using controller (source)', async () => {
      const off = offGroup();
      const it = iterate(src, { off });

      setTimeout(() => off(), 0);
      await expect(it.next()).rejects.toEqual(new Error('Unsubscribed !'));
    });
  });

  describe('on a listenable', () => {
    it('should iterate over multiplexer emits', async () => {
      const it = iterate(mlt, 'src');

      setTimeout(() => mlt.emit('src', 1), 0);
      await expect(it.next()).resolves.toEqual({ value: 1 });

      setTimeout(() => mlt.emit('src', 2), 0);
      await expect(it.next()).resolves.toEqual({ value: 2 });
    });

    it('should abort using controller (multiplexer)', async () => {
      const off = offGroup();
      const it = iterate(mlt, 'src', { off });

      setTimeout(() => off(), 0);
      await expect(it.next()).rejects.toEqual(new Error('Unsubscribed !'));
    });
  });
});
