import { beforeEach, describe, it, vi } from 'vitest';

import { Multiplexer, multiplexer, Source, source } from '@/src';

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
    it('should emit child event', ({ expect }) => {
      vi.spyOn(int, 'next');

      mlt.emit('int', 1);

      expect(int.next).toHaveBeenCalledWith(1);
    });

    it('should emit deep child event', ({ expect }) => {
      vi.spyOn(boo, 'next');

      mlt.emit('deep.boo', true);

      expect(boo.next).toHaveBeenCalledWith(true);
    });

    it('should not emit child event as child doesn\'t exists', ({ expect }) => {
      expect(() => mlt.emit('toto' as 'int', 1))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', ({ expect }) => {
      vi.spyOn(int, 'subscribe');
      const listener = vi.fn();

      mlt.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', ({ expect }) => {
      vi.spyOn(boo, 'subscribe');
      const listener = vi.fn();

      mlt.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should not subscribe to child event as child doesn\'t exists', ({ expect }) => {
      expect(() => mlt.on('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', ({ expect }) => {
      vi.spyOn(int, 'unsubscribe');
      const listener = vi.fn();

      mlt.off('int', listener);

      expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', ({ expect }) => {
      vi.spyOn(boo, 'unsubscribe');
      const listener = vi.fn();

      mlt.off('deep.boo', listener);

      expect(boo.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should not unsubscribe from child event as child doesn\'t exists', ({ expect }) => {
      expect(() => mlt.off('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('clear', () => {
    it('should clear child source', ({ expect }) => {
      vi.spyOn(int, 'clear');
      mlt.clear('int');

      expect(int.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', ({ expect }) => {
      vi.spyOn(boo, 'clear');
      mlt.clear('deep.boo');

      expect(boo.clear).toHaveBeenCalled();
    });

    it('should clear all child sources', ({ expect }) => {
      vi.spyOn(int, 'clear');
      vi.spyOn(str, 'clear');
      vi.spyOn(boo, 'clear');
      mlt.clear();

      expect(int.clear).toHaveBeenCalled();
      expect(str.clear).toHaveBeenCalled();
      expect(boo.clear).toHaveBeenCalled();
    });

    it('should not clear child as child doesn\'t exists', ({ expect }) => {
      expect(() => mlt.clear('toto' as 'int'))
        .toThrow(new Error('Child source toto not found'));
    });
  });
});
