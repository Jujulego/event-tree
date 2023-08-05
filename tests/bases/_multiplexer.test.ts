import { describe, it, vi } from 'vitest';

import { _multiplexer, IEmitter, IKeyEmitter, IListenable, IObservable } from '@/src';

// Tests
describe('_multiplexer', () => {
  describe('emit', () => {
    it('should emit child event', ({ expect }) => {
      const src: IEmitter<number> = {
        next: vi.fn(),
      };

      const getSource = vi.fn(() => src);

      const mlt = _multiplexer<Record<string, typeof src>>(() => [src], getSource);
      mlt.emit('life', 42);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.next).toHaveBeenCalledWith(42);
    });

    it('should emit deep child event', ({ expect }) => {
      const deep: IKeyEmitter<{ 'life': number }> = {
        emit: vi.fn(),
      };

      const getSource = vi.fn(() => deep);

      const mlt = _multiplexer<Record<string, typeof deep>>(() => [deep], getSource);
      mlt.emit('deep.life', 42);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.emit).toHaveBeenCalledWith('life', 42);
    });
  });

  describe('on', () => {
    it('should subscribe to child source', ({ expect }) => {
      const off = vi.fn();
      const src: IObservable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => src);
      const mlt = _multiplexer(() => [src], getSource);

      const listener = vi.fn();
      expect(mlt.on('life', listener)).toBe(off);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', ({ expect }) => {
      const off = vi.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => deep);
      const mlt = _multiplexer(() => [deep], getSource);

      const listener = vi.fn();
      expect(mlt.on('deep.life', listener)).toBe(off);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.on).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', ({ expect }) => {
      const off = vi.fn();
      const src: IObservable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => src);
      const mlt = _multiplexer(() => [src], getSource);

      const listener = vi.fn();
      mlt.off('life', listener);

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', ({ expect }) => {
      const off = vi.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => deep);
      const mlt = _multiplexer(() => [deep], getSource);

      const listener = vi.fn();
      mlt.off('deep.life', listener);

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.off).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('clear', () => {
    it('should clear child source', ({ expect }) => {
      const off = vi.fn();
      const src: IObservable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => src);
      const mlt = _multiplexer(() => [src], getSource);

      mlt.clear('life');

      expect(getSource).toHaveBeenCalledWith('life');
      expect(src.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', ({ expect }) => {
      const off = vi.fn();
      const deep: IListenable<{ 'life': number }> = {
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const getSource = vi.fn(() => deep);
      const mlt = _multiplexer(() => [deep], getSource);

      mlt.clear('deep.life');

      expect(getSource).toHaveBeenCalledWith('deep');
      expect(deep.clear).toHaveBeenCalledWith('life');
    });

    it('should clear all child sources', ({ expect }) => {
      const off = vi.fn();
      const src: IObservable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };
      const deep: IListenable<{ 'life': number }> = {
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const listSource = vi.fn(() => [src, deep]);
      const mlt = _multiplexer(listSource, () => src);

      mlt.clear();

      expect(listSource).toHaveBeenCalled();
      expect(src.clear).toHaveBeenCalled();
      expect(deep.clear).toHaveBeenCalled();
    });
  });
});
