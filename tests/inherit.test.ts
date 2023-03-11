import { inherit, multiplexer, Multiplexer, source, Source } from '../src';

// Setup
let mlt: Multiplexer<{
  a: Source<'a'>,
  b: Source<'b'>,
}>;
let src: Source<'c'>;

beforeEach(() => {
  mlt = multiplexer({
    a: source(),
    b: source(),
  });
  src = source();
});

// Tests
describe('inherit', () => {
  describe('emit', () => {
    it('should emit from src', () => {
      jest.spyOn(mlt, 'emit');
      jest.spyOn(src, 'emit');

      const child = inherit(mlt, { c: src });
      child.emit('c', 'c');

      expect(mlt.emit).not.toHaveBeenCalled();
      expect(src.emit).toHaveBeenCalledWith('c');
    });

    it('should emit from src (overriding mlt)', () => {
      jest.spyOn(mlt, 'emit');
      jest.spyOn(src, 'emit');

      const child = inherit(mlt, { a: src });
      child.emit('a', 'c');

      expect(mlt.emit).not.toHaveBeenCalled();
      expect(src.emit).toHaveBeenCalledWith('c');
    });

    it('should emit from mlt', () => {
      jest.spyOn(mlt, 'emit');
      jest.spyOn(src, 'emit');

      const child = inherit(mlt, { c: src });
      child.emit('a', 'a');

      expect(mlt.emit).toHaveBeenCalledWith('a', 'a');
      expect(src.emit).not.toHaveBeenCalled();
    });
  });

  describe('on', () => {
    it('should subscribe to src', () => {
      jest.spyOn(mlt, 'on');
      jest.spyOn(src, 'subscribe');
      const listener = jest.fn();

      const child = inherit(mlt, { c: src });
      child.on('c', listener);

      expect(mlt.on).not.toHaveBeenCalled();
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to src (overriding mlt)', () => {
      jest.spyOn(mlt, 'on');
      jest.spyOn(src, 'subscribe');
      const listener = jest.fn();

      const child = inherit(mlt, { a: src });
      child.on('a', listener);

      expect(mlt.on).not.toHaveBeenCalled();
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to mlt', () => {
      jest.spyOn(mlt, 'on');
      jest.spyOn(src, 'subscribe');
      const listener = jest.fn();

      const child = inherit(mlt, { c: src });
      child.on('a', listener);

      expect(mlt.on).toHaveBeenCalledWith('a', listener);
      expect(src.subscribe).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should unsubscribe from src', () => {
      jest.spyOn(mlt, 'off');
      jest.spyOn(src, 'unsubscribe');
      const listener = jest.fn();

      const child = inherit(mlt, { c: src });
      child.off('c', listener);

      expect(mlt.off).not.toHaveBeenCalled();
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from src (overriding mlt)', () => {
      jest.spyOn(mlt, 'off');
      jest.spyOn(src, 'unsubscribe');
      const listener = jest.fn();

      const child = inherit(mlt, { a: src });
      child.off('a', listener);

      expect(mlt.off).not.toHaveBeenCalled();
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from mlt', () => {
      jest.spyOn(mlt, 'off');
      jest.spyOn(src, 'unsubscribe');
      const listener = jest.fn();

      const child = inherit(mlt, { c: src });
      child.off('a', listener);

      expect(mlt.off).toHaveBeenCalledWith('a', listener);
      expect(src.unsubscribe).not.toHaveBeenCalled();
    });
  });
});
