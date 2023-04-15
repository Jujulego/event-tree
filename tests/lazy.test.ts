import {
  EventMap,
  group,
  Group,
  IListenable,
  IObservable,
  lazy,
  multiplexer,
  Multiplexer,
  source,
  Source
} from '@/src';

// Setup
let src: Source<number>;
let grp: Group<{ src: Source<number> }>;
let mlt: Multiplexer<{ src: Source<number> }>;

beforeEach(() => {
  src = source();
  grp = group({ src });
  mlt = multiplexer({ src });
});

// Tests
describe('lazy', () => {
  it('should call getter only once', () => {
    const getter = jest.fn(() => src);
    const lzy = lazy(getter);

    lzy.subscribe(() => null);
    lzy.subscribe(() => null);
    lzy.subscribe(() => null);

    expect(getter).toHaveBeenCalledTimes(1);
  });

  describe('on multiplexer (listenable & key emitter)', () => {
    it('should return original emit', () => {
      const lzy = lazy(() => mlt);
      expect(lzy.emit).toBe(mlt.emit);
    });

    it('should return original on', () => {
      const lzy = lazy(() => mlt);
      expect(lzy.on).toBe(mlt.on);
    });

    it('should return original off', () => {
      const lzy = lazy(() => mlt);
      expect(lzy.off).toBe(mlt.off);
    });

    it('should return undefined for subscribe', () => {
      const lzy = lazy(() => mlt);
      expect((lzy as unknown as IObservable<unknown>).subscribe).toBeUndefined();
    });

    it('should return undefined for unsubscribe', () => {
      const lzy = lazy(() => mlt);
      expect((lzy as unknown as IObservable<unknown>).unsubscribe).toBeUndefined();
    });

    it('should return original clear', () => {
      const lzy = lazy(() => mlt);
      expect(lzy.clear).toBe(mlt.clear);
    });
  });

  describe('on source (observable & emitter)', () => {
    it('should return original emit', () => {
      const lzy = lazy(() => src);
      expect(lzy.emit).toBe(src.emit);
    });

    it('should return undefined for on', () => {
      const lzy = lazy(() => src);
      expect((lzy as unknown as IListenable<EventMap>).on).toBeUndefined();
    });

    it('should return undefined for off', () => {
      const lzy = lazy(() => src);
      expect((lzy as unknown as IListenable<EventMap>).off).toBeUndefined();
    });

    it('should return original subscribe', () => {
      const lzy = lazy(() => src);
      expect(lzy.subscribe).toBe(src.subscribe);
    });

    it('should return original unsubscribe', () => {
      const lzy = lazy(() => src);
      expect(lzy.unsubscribe).toBe(src.unsubscribe);
    });

    it('should return original clear', () => {
      const lzy = lazy(() => src);
      expect(lzy.clear).toBe(src.clear);
    });
  });

  describe('on group (listenable & key emitter & observable & emitter)', () => {
    it('should return original emit', () => {
      const lzy = lazy(() => grp);
      expect(lzy.emit).toBe(grp.emit);
    });

    it('should return original on', () => {
      const lzy = lazy(() => grp);
      expect(lzy.on).toBe(grp.on);
    });

    it('should return original off', () => {
      const lzy = lazy(() => grp);
      expect(lzy.off).toBe(grp.off);
    });

    it('should return original subscribe', () => {
      const lzy = lazy(() => grp);
      expect(lzy.subscribe).toBe(grp.subscribe);
    });

    it('should return original unsubscribe', () => {
      const lzy = lazy(() => grp);
      expect(lzy.unsubscribe).toBe(grp.unsubscribe);
    });

    it('should return original clear', () => {
      const lzy = lazy(() => grp);
      expect(lzy.clear).toBe(grp.clear);
    });
  });
});
