import { multiplexer, Multiplexer, offGroup, source, Source, waitFor } from '../src';

// Setup
let src: Source<number>;
let mlt: Multiplexer<{ src: Source<number> }>;

beforeEach(() => {
  src = source();
  mlt = multiplexer({ src });
});

describe('waitFor', () => {
  describe('on an observable', () => {
    it('should resolve when observable emits', async () => {
      setTimeout(() => src.emit(1), 0);

      await expect(waitFor(src)).resolves.toBe(1);
    });

    it('should join given off group', async () => {
      const off = offGroup();
      jest.spyOn(off, 'add');

      const prom = waitFor(src, { off });

      expect(off.add).toHaveBeenCalledTimes(2);

      setTimeout(() => off(), 0);

      await expect(prom).rejects.toEqual(new Error('Unsubscribed !'));
    });
  });

  describe('on a listenable', () => {
    it('should resolve when listenable emits', async () => {
      setTimeout(() => mlt.emit('src', 1), 0);

      await expect(waitFor(mlt, 'src')).resolves.toBe(1);
    });

    it('should join given off group', async () => {
      const off = offGroup();
      jest.spyOn(off, 'add');

      const prom = waitFor(mlt, 'src', { off });

      expect(off.add).toHaveBeenCalledTimes(2);

      setTimeout(() => off(), 0);

      await expect(prom).rejects.toEqual(new Error('Unsubscribed !'));
    });
  });
});
