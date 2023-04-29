import { dynamic, multiplexer, Multiplexer, Source, source } from '@/src';

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
      const spy = jest.fn();

      dyn.on('life', spy);
      origin.emit(mlt);

      mlt.emit('life', 42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should call next registered listeners', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.on('life', () => null);
      origin.emit(mlt);

      dyn.on('life', spy);
      mlt.emit('life', 42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should not call removed listener (callback)', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      const off = dyn.on('life', spy);
      origin.emit(mlt);
      off();

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (off)', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.on('life', spy);
      dyn.off('life', spy);
      origin.emit(mlt);

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (clear)', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.on('life', spy);
      dyn.clear();
      origin.emit(mlt);

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call registered listener if source has been replaced', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.on('life', spy);
      origin.emit(mlt);
      origin.emit(multiplexer({ life: source() }));

      mlt.emit('life', 42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should call registered listener if next source emits', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.on('life', spy);
      origin.emit(multiplexer({ life: source() }));
      origin.emit(mlt);

      mlt.emit('life', 42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should warn if emitted source does not support listenable operation', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();
      jest.spyOn(console, 'warn');

      dyn.on('life', spy);
      origin.emit(source() as any);

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
      const spy = jest.fn();

      dyn.subscribe(spy);
      origin.emit(src);

      src.emit(42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should call next registered listeners', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.subscribe(() => null);
      origin.emit(src);

      dyn.subscribe(spy);
      src.emit(42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should not call removed listener (callback)', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      const off = dyn.subscribe(spy);
      origin.emit(src);
      off();

      src.emit(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (unsubscribe)', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.subscribe(spy);
      dyn.unsubscribe(spy);
      origin.emit(src);

      src.emit(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call removed listener (clear)', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.subscribe(spy);
      dyn.clear();
      origin.emit(src);

      src.emit(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should not call registered listener if source has been replaced', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.subscribe(spy);
      origin.emit(src);
      origin.emit(source());

      src.emit(42);

      expect(spy).not.toHaveBeenCalledWith();
    });

    it('should call registered listener if next source emits', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();

      dyn.subscribe(spy);
      origin.emit(source());
      origin.emit(src);

      src.emit(42);

      expect(spy).toHaveBeenCalledWith(42);
    });

    it('should warn if emitted source does not support observable operation', () => {
      const dyn = dynamic(origin);
      const spy = jest.fn();
      jest.spyOn(console, 'warn');

      dyn.subscribe(spy);
      origin.emit(multiplexer({}) as any);

      expect(console.warn).toHaveBeenCalled();
    });
  });
});
