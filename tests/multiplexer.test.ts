import { Multiplexer, multiplexer, Source, source } from '../src';

// Setup
let int: Source<number>;
let str: Source<string>;
let boo: Source<boolean>;
let mlt: Multiplexer<{
  int: Source<number>,
  str: Source<string>,
  deep: Multiplexer<{
    boo: Source<boolean>,
  }>
}>;

beforeEach(() => {
  int = source();
  str = source();
  boo = source();
  mlt = multiplexer({
    int,
    str,
    deep: multiplexer({
      boo
    })
  });
});

// Tests
describe('multiplexer', () => {
  describe('emit', () => {
    it('should emit child event', () => {
      jest.spyOn(int, 'emit');

      mlt.emit('int', 1);

      expect(int.emit).toHaveBeenCalledWith(1);
    });

    it('should emit deep child event', () => {
      jest.spyOn(boo, 'emit');

      mlt.emit('deep.boo', true);

      expect(boo.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit child event as child doesn\'t exists', () => {
      expect(() => mlt.emit('toto' as 'int', 1))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      jest.spyOn(int, 'subscribe');
      const listener = jest.fn();

      mlt.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      jest.spyOn(boo, 'subscribe');
      const listener = jest.fn();

      mlt.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should not subscribe to child event as child doesn\'t exists', () => {
      expect(() => mlt.on('toto' as 'int', jest.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      jest.spyOn(int, 'unsubscribe');
      const listener = jest.fn();

      mlt.off('int', listener);

      expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      jest.spyOn(boo, 'unsubscribe');
      const listener = jest.fn();

      mlt.off('deep.boo', listener);

      expect(boo.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should not unsubscribe from child event as child doesn\'t exists', () => {
      expect(() => mlt.off('toto' as 'int', jest.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('clear', () => {
    it('should clear child source', () => {
      jest.spyOn(int, 'clear');
      mlt.clear('int');

      expect(int.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      jest.spyOn(boo, 'clear');
      mlt.clear('deep.boo');

      expect(boo.clear).toHaveBeenCalled();
    });

    it('should clear all child sources', () => {
      jest.spyOn(int, 'clear');
      jest.spyOn(str, 'clear');
      jest.spyOn(boo, 'clear');
      mlt.clear();

      expect(int.clear).toHaveBeenCalled();
      expect(str.clear).toHaveBeenCalled();
      expect(boo.clear).toHaveBeenCalled();
    });

    it('should not clear child as child doesn\'t exists', () => {
      expect(() => mlt.clear('toto' as 'int'))
        .toThrow(new Error('Child source toto not found'));
    });
  });
});
