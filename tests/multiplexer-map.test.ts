import { IEmitter, IKeyEmitter, IListenable, IObservable, multiplexerMap } from '@/src';

// Tests
describe('multiplexerMap', () => {
  describe('emit', () => {
    it('should emit child event', () => {
      const src: IEmitter<number> = {
        next: jest.fn(),
      };

      const builder = jest.fn(() => src);

      const mlt = multiplexerMap(builder);
      mlt.emit('life', 42);

      expect(builder).toHaveBeenCalledWith('life');
      expect(src.next).toHaveBeenCalledWith(42);
    });

    it('should emit deep child event', () => {
      const deep: IKeyEmitter<{ 'life': number }> = {
        emit: jest.fn(),
      };

      const builder = jest.fn(() => deep);

      const mlt = multiplexerMap(builder);
      mlt.emit('deep.life', 42);

      expect(builder).toHaveBeenCalledWith('deep');
      expect(deep.emit).toHaveBeenCalledWith('life', 42);
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      const off = jest.fn();
      const src: IObservable<number> = {
        subscribe: jest.fn(() => off),
        unsubscribe: jest.fn(),
        clear: jest.fn(),
      };

      const builder = jest.fn(() => src);
      const mlt = multiplexerMap(builder);

      const listener = jest.fn();
      expect(mlt.on('life', listener)).toBe(off);

      expect(builder).toHaveBeenCalledWith('life');
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      const off = jest.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const builder = jest.fn(() => deep);
      const mlt = multiplexerMap(builder);

      const listener = jest.fn();
      expect(mlt.on('deep.life', listener)).toBe(off);

      expect(builder).toHaveBeenCalledWith('deep');
      expect(deep.on).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      const off = jest.fn();
      const src: IObservable<number> = {
        subscribe: jest.fn(() => off),
        unsubscribe: jest.fn(),
        clear: jest.fn(),
      };

      const builder = jest.fn(() => src);
      const mlt = multiplexerMap(builder);

      const listener = jest.fn();
      mlt.off('life', listener);

      expect(builder).toHaveBeenCalledWith('life');
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      const off = jest.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const builder = jest.fn(() => deep);
      const mlt = multiplexerMap(builder);

      const listener = jest.fn();
      mlt.off('deep.life', listener);

      expect(builder).toHaveBeenCalledWith('deep');
      expect(deep.off).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('clear', () => {
    it('should clear child source', () => {
      const off = jest.fn();
      const src: IObservable<number> = {
        subscribe: jest.fn(() => off),
        unsubscribe: jest.fn(),
        clear: jest.fn(),
      };

      const mlt = multiplexerMap(() => src);
      mlt.on('life', () => null); // <= creates source
      mlt.clear('life');

      expect(src.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      const off = jest.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const mlt = multiplexerMap(() => deep);
      mlt.on('deep.life', () => null); // <= creates source
      mlt.clear('deep.life');

      expect(deep.clear).toHaveBeenCalledWith('life');
    });

    it('should clear all child sources', () => {
      const off = jest.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const mlt = multiplexerMap(() => deep);
      mlt.on('deep1.life', () => null); // <= creates source
      mlt.on('deep2.life', () => null); // <= creates source
      mlt.clear();

      expect(deep.clear).toHaveBeenCalledTimes(2); // (one for each "created" sources)
    });
  });
});
