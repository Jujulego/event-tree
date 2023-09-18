import { vi } from 'vitest';

import { _group$ } from '@/src/bases/_group.js';
import { Multiplexer, Source, Listener, OffFn } from '@/src/defs/index.js';

// Setup
let off: OffFn;
let mlt: Multiplexer<{ life: number }, { life: number }>;
let src: Source<number>;

beforeEach(() => {
  off = vi.fn();
  mlt = {
    emit: vi.fn(),
    on: vi.fn(() => off),
    off: vi.fn(),
    clear: vi.fn(),
  };
  src = {
    next: vi.fn(),
    subscribe: vi.fn(() => off),
    unsubscribe: vi.fn(),
    clear: vi.fn(),
  };
});

// Tests
describe('_group', () => {
  describe('emit', () => {
    it('should emit event on both multiplexer and source', () => {
      const grp = _group$(mlt, src);
      grp.emit('life', 42);

      expect(mlt.emit).toHaveBeenCalledWith('life', 42);
      expect(src.next).toHaveBeenCalledWith(42);
    });
  });

  describe('on', () => {
    it('should listen to multiplexer', () => {
      const grp = _group$(mlt, src);
      const listener: Listener<number> = vi.fn();

      expect(grp.on('life', listener)).toBe(off);

      expect(mlt.on).toHaveBeenCalledWith('life', listener);
      expect(src.subscribe).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should stop listening to multiplexer', () => {
      const grp = _group$(mlt, src);
      const listener: Listener<number> = vi.fn();

      grp.off('life', listener);

      expect(mlt.off).toHaveBeenCalledWith('life', listener);
      expect(src.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('subscribe', () => {
    it('should subscribe to source', () => {
      const grp = _group$(mlt, src);
      const listener: Listener<number> = vi.fn();

      expect(grp.subscribe(listener)).toBe(off);

      expect(mlt.on).not.toHaveBeenCalled();
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from source', () => {
      const grp = _group$(mlt, src);
      const listener: Listener<number> = vi.fn();

      grp.unsubscribe(listener);

      expect(mlt.off).not.toHaveBeenCalled();
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });
  });

  describe('clear', () => {
    it('should clear only one event of multiplexer', () => {
      const grp = _group$(mlt, src);

      grp.clear('life');

      expect(mlt.clear).toHaveBeenCalledWith('life');
      expect(src.clear).not.toHaveBeenCalled();
    });

    it('should clear all events of multiplexer & source', () => {
      const grp = _group$(mlt, src);

      grp.clear();

      expect(mlt.clear).toHaveBeenCalledWith(undefined);
      expect(src.clear).toHaveBeenCalledWith();
    });
  });
});
