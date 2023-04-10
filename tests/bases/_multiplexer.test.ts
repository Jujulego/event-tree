import { _multiplexer } from '../../src/bases/_multiplexer';
import { IEmitter } from '../../src/defs/emitter';
import { IKeyEmitter } from '../../src/defs/key-emitter';
import { IListenable, IObservable } from '../../src';

// Tests
describe('_multiplexer', () => {
  describe('emit', () => {
    it('should emit child event', () => {
      const src: IEmitter<number> = {
        emit: jest.fn(),
      };

      const getSource = jest.fn(() => src);

      const mlt = _multiplexer(() => [src], getSource);
      mlt.emit('life', 42);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.emit).toHaveBeenCalledWith(42);
    });

    it('should emit deep child event', () => {
      const deep: IKeyEmitter<{ 'life': number }> = {
        emit: jest.fn(),
      };

      const getSource = jest.fn(() => deep);

      const mlt = _multiplexer(() => [deep], getSource);
      mlt.emit('deep.life', 42);

      expect(getSource).toHaveBeenCalledWith('deep');
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

      const getSource = jest.fn(() => src);
      const mlt = _multiplexer(() => [src], getSource);

      const listener = jest.fn();
      expect(mlt.on('life', listener)).toBe(off);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      const off = jest.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const getSource = jest.fn(() => deep);
      const mlt = _multiplexer(() => [deep], getSource);

      const listener = jest.fn();
      expect(mlt.on('deep.life', listener)).toBe(off);

      expect(getSource).toHaveBeenCalledWith('deep');
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

      const getSource = jest.fn(() => src);
      const mlt = _multiplexer(() => [src], getSource);

      const listener = jest.fn();
      mlt.off('life', listener);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      const off = jest.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const getSource = jest.fn(() => deep);
      const mlt = _multiplexer(() => [deep], getSource);

      const listener = jest.fn();
      mlt.off('deep.life', listener);

      expect(getSource).toHaveBeenCalledWith('deep');
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

      const getSource = jest.fn(() => src);
      const mlt = _multiplexer(() => [src], getSource);

      mlt.clear('life');

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      const off = jest.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const getSource = jest.fn(() => deep);
      const mlt = _multiplexer(() => [deep], getSource);

      mlt.clear('deep.life');

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.clear).toHaveBeenCalledWith('life');
    });

    it('should clear all child sources', () => {
      const off = jest.fn();
      const src: IObservable<number> = {
        subscribe: jest.fn(() => off),
        unsubscribe: jest.fn(),
        clear: jest.fn(),
      };
      const deep: IListenable<{ 'life': number }> = {
        on: jest.fn(() => off),
        off: jest.fn(),
        clear: jest.fn(),
      };

      const listSource = jest.fn(() => [src, deep]);
      const mlt = _multiplexer(listSource, () => src);

      mlt.clear();

      expect(listSource).toHaveBeenCalled();
      expect(src.clear).toHaveBeenCalled();
      expect(deep.clear).toHaveBeenCalled();
    });
  });
});
