import { vi } from 'vitest';

import { _multiplexer$ } from '@/src/bases/_multiplexer.js';
import { AnySource, Emitter, KeyEmitter } from '@/src/defs/index.js';
import { source$ } from '@/src/source.js';
import { multiplexer$ } from '@/src/multiplexer.js';

// Tests
describe('_multiplexer', () => {
  describe('emit', () => {
    it('should emit child event', () => {
      const src = source$<number>();
      vi.spyOn(src, 'next');

      const getSource = vi.fn(() => src);

      const mlt = _multiplexer$<{ life: Emitter<number> }>(
        new Map([['life', src]]),
        getSource
      );
      mlt.emit('life', 42);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.next).toHaveBeenCalledWith(42);
    });

    it('should emit deep child event', () => {
      const deep = multiplexer$({ life: source$<number>() });
      vi.spyOn(deep, 'emit');

      const getSource = vi.fn(() => deep);

      const mlt = _multiplexer$<{ deep: KeyEmitter<{ life: number }>}>(
        new Map([['deep', deep]]),
        getSource,
      );
      mlt.emit('deep.life', 42);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.emit).toHaveBeenCalledWith('life', 42);
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      const src = source$<number>();
      vi.spyOn(src, 'subscribe');

      const getSource = vi.fn(() => src);
      const mlt =  _multiplexer$(
        new Map<string, AnySource>([['life', src]]),
        getSource
      );

      const listener = vi.fn();
      expect(mlt.on('life', listener)).toEqual(expect.any(Function));

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      const deep = multiplexer$({ life: source$<number>() });
      vi.spyOn(deep, 'on');

      const getSource = vi.fn(() => deep);
      const mlt =  _multiplexer$(
        new Map<string, AnySource>([['deep', deep]]),
        getSource,
      );

      const listener = vi.fn();
      expect(mlt.on('deep.life', listener)).toEqual(expect.any(Function));

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.on).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      const src = source$<number>();
      vi.spyOn(src, 'unsubscribe');

      const getSource = vi.fn(() => src);
      const mlt =  _multiplexer$(
        new Map<string, AnySource>([['life', src]]),
        getSource
      );

      const listener = vi.fn();
      mlt.off('life', listener);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      const deep = multiplexer$({ life: source$<number>() });
      vi.spyOn(deep, 'off');

      const getSource = vi.fn(() => deep);
      const mlt =  _multiplexer$(
        new Map<string, AnySource>([['deep', deep]]),
        getSource,
      );

      const listener = vi.fn();
      mlt.off('deep.life', listener);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.off).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('clear', () => {
    it('should clear child source', () => {
      const src = source$<number>();
      vi.spyOn(src, 'clear');

      const getSource = vi.fn(() => src);
      const mlt =  _multiplexer$(
        new Map<string, AnySource>([['life', src]]),
        getSource
      );

      mlt.clear('life');

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      const deep = multiplexer$({ life: source$<number>() });
      vi.spyOn(deep, 'clear');

      const getSource = vi.fn(() => deep);
      const mlt =  _multiplexer$(
        new Map<string, AnySource>([['deep', deep]]),
        getSource,
      );

      mlt.clear('deep.life');

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.clear).toHaveBeenCalledWith('life');
    });

    it('should clear all child sources', () => {
      const src = source$<number>();
      vi.spyOn(src, 'clear');

      const deep = multiplexer$({ life: source$<number>() });
      vi.spyOn(deep, 'clear');

      const mlt = _multiplexer$(
        new Map<string, AnySource>([['deep', deep], ['life', src]]),
        () => src,
      );

      mlt.clear();

      expect(src.clear).toHaveBeenCalled();
      expect(deep.clear).toHaveBeenCalled();
    });
  });
});
