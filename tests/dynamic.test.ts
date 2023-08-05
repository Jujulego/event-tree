import { vi } from 'vitest';

import { dynamic } from '@/src/dynamic';
import { multiplexer, Multiplexer } from '@/src/multiplexer';
import { source, Source } from '@/src/source';

// Tests
describe('dynamic', () => {
  describe('for listenable', () => {
    let mlt: Multiplexer<{ 'life': Source<number> }>;
    let origin: Source<typeof mlt>;

    beforeEach(() => {
      mlt = multiplexer({
        life: source()
      });
      origin = source();
    });

    it('should call previously registered listeners', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.on('life', spy);
      origin.next(mlt);

      mlt.emit('life', 42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should call next registered listeners', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.on('life', () => null);
      origin.next(mlt);

      dyn.on('life', spy);
      mlt.emit('life', 42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should not call removed listener (callback)', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      const off = dyn.on('life', spy);
      origin.next(mlt);
      off();

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (off)', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.on('life', spy);
      dyn.off('life', spy);
      origin.next(mlt);

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (clear)', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.on('life', spy);
      dyn.clear();
      origin.next(mlt);

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call registered listener if source has been replaced', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.on('life', spy);
      origin.next(mlt);
      origin.next(multiplexer({ life: source() }));

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should call registered listener if next source emits', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.on('life', spy);
      origin.next(multiplexer({ life: source() }));
      origin.next(mlt);

      mlt.emit('life', 42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should warn if emitted source does not support listenable operation', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();
      vi.spyOn(console, 'warn');

      dyn.on('life', spy);
      origin.next(source() as unknown as Multiplexer<{ life: Source<number> }>);

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('for observable', () => {
    let src: Source<number>;
    let origin: Source<typeof src>;

    beforeEach(() => {
      src = source();
      origin = source();
    });

    it('should call previously registered listeners', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.subscribe(spy);
      origin.next(src);

      src.next(42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should call next registered listeners', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.subscribe(() => null);
      origin.next(src);

      dyn.subscribe(spy);
      src.next(42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should not call removed listener (callback)', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      const off = dyn.subscribe(spy);
      origin.next(src);
      off();

      src.next(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (unsubscribe)', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.subscribe(spy);
      dyn.unsubscribe(spy);
      origin.next(src);

      src.next(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (clear)', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.subscribe(spy);
      dyn.clear();
      origin.next(src);

      src.next(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call registered listener if source has been replaced', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.subscribe(spy);
      origin.next(src);
      origin.next(source());

      src.next(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should call registered listener if next source emits', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();

      dyn.subscribe(spy);
      origin.next(source());
      origin.next(src);

      src.next(42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should warn if emitted source does not support observable operation', () => {
      const dyn = dynamic(origin);
      const spy = vi.fn();
      vi.spyOn(console, 'warn');

      dyn.subscribe(spy);
      origin.next(multiplexer({}) as unknown as Source<number>);

      expect(console.warn).toHaveBeenCalled();
    });
  });
});
