import { _group } from '../../src/bases/_group';
import { AnyEventMap, IMultiplexer, ISource, Listener, OffFn } from '../../src';

// Setup
let off: OffFn;
let mlt: IMultiplexer<AnyEventMap, AnyEventMap>;
let src: ISource<any>;

beforeEach(() => {
  off = jest.fn();
  mlt = {
    emit: jest.fn(),
    on: jest.fn(() => off),
    off: jest.fn(),
    clear: jest.fn(),
  };
  src = {
    emit: jest.fn(),
    subscribe: jest.fn(() => off),
    unsubscribe: jest.fn(),
    clear: jest.fn(),
  };
});

// Tests
describe('_group', () => {
  describe('emit', () => {
    it('should emit event on both multiplexer and source', () => {
      const grp = _group(mlt, src);
      grp.emit('life', 42);

      expect(mlt.emit).toHaveBeenCalledWith('life', 42);
      expect(src.emit).toHaveBeenCalledWith(42);
    });
  });

  describe('on', () => {
    it('should listen to multiplexer', () => {
      const grp = _group(mlt, src);
      const listener: Listener<number> = jest.fn();

      expect(grp.on('life', listener)).toBe(off);

      expect(mlt.on).toHaveBeenCalledWith('life', listener);
      expect(src.subscribe).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should stop listening to multiplexer', () => {
      const grp = _group(mlt, src);
      const listener: Listener<number> = jest.fn();

      grp.off('life', listener);

      expect(mlt.off).toHaveBeenCalledWith('life', listener);
      expect(src.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('subscribe', () => {
    it('should subscribe to source', () => {
      const grp = _group(mlt, src);
      const listener: Listener<number> = jest.fn();

      expect(grp.subscribe(listener)).toBe(off);

      expect(mlt.on).not.toHaveBeenCalled();
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from source', () => {
      const grp = _group(mlt, src);
      const listener: Listener<number> = jest.fn();

      grp.unsubscribe(listener);

      expect(mlt.off).not.toHaveBeenCalled();
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });
  });

  describe('clear', () => {
    it('should clear only one event of multiplexer', () => {
      const grp = _group(mlt, src);

      grp.clear('life');

      expect(mlt.clear).toHaveBeenCalledWith('life');
      expect(src.clear).not.toHaveBeenCalled();
    });

    it('should clear all events of multiplexer & source', () => {
      const grp = _group(mlt, src);

      grp.clear();

      expect(mlt.clear).toHaveBeenCalledWith(undefined);
      expect(src.clear).toHaveBeenCalledWith();
    });
  });
});
