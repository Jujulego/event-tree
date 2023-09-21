import { vi } from 'vitest';

import { _multiplexer$ } from '@/src/bases/_multiplexer.js';
import { Emitter, KeyEmitter, Listenable, Observable } from '@/src/defs/index.js';

// Tests
describe('_multiplexer', () => {
  describe('emit', () => {
    it('should emit child event', () => {
      const src: Emitter<number> = {
        next: vi.fn(),
      };

      const getSource = vi.fn(() => src);

      const mlt = _multiplexer$<Record<'life', typeof src>>({
        keys: () => ['life'],
        sources: () => [src],
        getSource,
      });
      mlt.emit('life', 42);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.next).toHaveBeenCalledWith(42);
    });

    it('should emit deep child event', () => {
      const deep: KeyEmitter<{ 'life': number }> = {
        emit: vi.fn(),
      };

      const getSource = vi.fn(() => deep);

      const mlt = _multiplexer$<Record<'deep', typeof deep>>({
        keys: () => ['deep.life'],
        sources: () => [deep],
        getSource,
      });
      mlt.emit('deep.life', 42);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.emit).toHaveBeenCalledWith('life', 42);
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      const off = vi.fn();
      const src: Observable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => src);
      const mlt = _multiplexer$<Record<'life', typeof src>>({
        keys: () => ['life'],
        sources: () => [src],
        getSource,
      });

      const listener = vi.fn();
      expect(mlt.on('life', listener)).toBe(off);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      const off = vi.fn();
      const deep: Listenable<{ 'life': number }> = {
        keys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => deep);
      const mlt = _multiplexer$<Record<'deep', typeof deep>>({
        keys: () => ['deep.life'],
        sources: () => [deep],
        getSource,
      });

      const listener = vi.fn();
      expect(mlt.on('deep.life', listener)).toBe(off);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.on).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      const off = vi.fn();
      const src: Observable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => src);
      const mlt = _multiplexer$({
        keys: () => ['life'],
        sources: () => [src],
        getSource,
      });

      const listener = vi.fn();
      mlt.off('life', listener);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      const off = vi.fn();
      const deep: Listenable<{ 'life': number }> = {
        keys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => deep);
      const mlt = _multiplexer$<Record<'deep', typeof deep>>({
        keys: () => ['deep.life'],
        sources: () => [deep],
        getSource,
      });

      const listener = vi.fn();
      mlt.off('deep.life', listener);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.off).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('clear', () => {
    it('should clear child source', () => {
      const off = vi.fn();
      const src: Observable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => src);
      const mlt = _multiplexer$<Record<'life', typeof src>>({
        keys: () => ['life'],
        sources: () => [src],
        getSource,
      });

      mlt.clear('life');

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      const off = vi.fn();
      const deep: Listenable<{ 'life': number }> = {
        keys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => deep);
      const mlt = _multiplexer$<Record<string, typeof deep>>({
        keys: () => ['deep.life'],
        sources: () => [deep],
        getSource,
      });

      mlt.clear('deep.life');

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.clear).toHaveBeenCalledWith('life');
    });

    it('should clear all child sources', () => {
      const off = vi.fn();
      const src: Observable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };
      const deep: Listenable<{ 'life': number }> = {
        keys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const sources = vi.fn(() => [src, deep]);
      const mlt = _multiplexer$<Record<'life' | 'deep', typeof src | typeof deep>>({
        keys: () => ['life', 'deep.life'],
        sources,
        getSource: () => src,
      });

      mlt.clear();

      expect(sources).toHaveBeenCalled();
      expect(src.clear).toHaveBeenCalled();
      expect(deep.clear).toHaveBeenCalled();
    });
  });
});
