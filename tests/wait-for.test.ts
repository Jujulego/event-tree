import { group, Group, multiplexer, Multiplexer, offGroup, source, Source, waitFor } from '@/src';

// Setup
let src: Source<number>;
let mlt: Multiplexer<{ src: Source<number> }>;
let grp: Group<{ src: Source<number> }>;

beforeEach(() => {
  src = source();
  mlt = multiplexer({ src });
  grp = group({ src });
});

describe('waitFor', () => {
  describe('on an observable', () => {
    it('should resolve when observable emits', async () => {
      setTimeout(() => src.next(1), 0);

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

  describe('on a listenable observable', () => {
    it('should resolve when listenable part emits', async () => {
      setTimeout(() => grp.emit('src', 1), 0);
      jest.spyOn(grp, 'on');
      jest.spyOn(grp, 'subscribe');

      await expect(waitFor(grp, 'src')).resolves.toBe(1);

      expect(grp.on).toHaveBeenCalledWith('src', expect.any(Function));
      expect(grp.subscribe).not.toHaveBeenCalled();
    });

    it('should resolve when observable part emits', async () => {
      setTimeout(() => grp.emit('src', 1), 0);
      jest.spyOn(grp, 'on');
      jest.spyOn(grp, 'subscribe');

      await expect(waitFor(grp)).resolves.toBe(1);

      expect(grp.on).not.toHaveBeenCalled();
      expect(grp.subscribe).toHaveBeenCalled();
    });
  });
});
