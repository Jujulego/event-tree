import { beforeEach, describe, it, vi } from 'vitest';

import { Group, group, Listener, multiplexer, Multiplexer, Source, source } from '@/src';

// Setup
let int: Source<number>;
let str: Source<string>;
let boo: Source<boolean>;
let grp: Group<{
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
  grp = group({
    int,
    str,
    deep: multiplexer({
      boo
    })
  });
});

// Tests
describe('group', () => {
  it('should call group listener when emitting a child event', ({ expect }) => {
    const listener: Listener<number | string | boolean> = vi.fn();

    grp.subscribe(listener);
    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).toHaveBeenCalledWith(1);
    expect(listener).toHaveBeenCalledWith('toto');
    expect(listener).toHaveBeenCalledWith(true);
  });

  it('should not call removed listeners (off method)', ({ expect }) => {
    const listener: Listener<number | string | boolean> = vi.fn();

    grp.subscribe(listener);
    grp.unsubscribe(listener);

    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call removed listeners (returned off)', ({ expect }) => {
    const listener: Listener<number | string | boolean> = vi.fn();

    const off = grp.subscribe(listener);
    off();

    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).not.toHaveBeenCalled();
  });

  describe('emit', () => {
    it('should emit child event', ({ expect }) => {
      vi.spyOn(int, 'next');

      grp.emit('int', 1);

      expect(int.next).toHaveBeenCalledWith(1);
    });

    it('should emit deep child event', ({ expect }) => {
      vi.spyOn(boo, 'next');

      grp.emit('deep.boo', true);

      expect(boo.next).toHaveBeenCalledWith(true);
    });

    it('should not emit child event as child doesn\'t exists', ({ expect }) => {
      expect(() => grp.emit('toto' as 'int', 1))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', ({ expect }) => {
      vi.spyOn(int, 'subscribe');
      const listener = vi.fn();

      grp.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', ({ expect }) => {
      vi.spyOn(boo, 'subscribe');
      const listener = vi.fn();

      grp.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should not subscribe to child event as child doesn\'t exists', ({ expect }) => {
      expect(() => grp.on('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', ({ expect }) => {
      vi.spyOn(int, 'unsubscribe');
      const listener = vi.fn();

      grp.off('int', listener);

      expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', ({ expect }) => {
      vi.spyOn(boo, 'unsubscribe');
      const listener = vi.fn();

      grp.off('deep.boo', listener);

      expect(boo.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should not unsubscribe from child event as child doesn\'t exists', ({ expect }) => {
      expect(() => grp.off('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('clear', () => {
    it('should clear child source', ({ expect }) => {
      vi.spyOn(int, 'clear');
      grp.clear('int');

      expect(int.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', ({ expect }) => {
      vi.spyOn(boo, 'clear');
      grp.clear('deep.boo');

      expect(boo.clear).toHaveBeenCalled();
    });

    it('should clear all child sources', ({ expect }) => {
      vi.spyOn(int, 'clear');
      vi.spyOn(str, 'clear');
      vi.spyOn(boo, 'clear');
      grp.clear();

      expect(int.clear).toHaveBeenCalled();
      expect(str.clear).toHaveBeenCalled();
      expect(boo.clear).toHaveBeenCalled();
    });

    it('should not clear child as child doesn\'t exists', ({ expect }) => {
      expect(() => grp.clear('toto' as 'int'))
        .toThrow(new Error('Child source toto not found'));
    });
  });
});
