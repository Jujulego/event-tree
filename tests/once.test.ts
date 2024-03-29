import { vi } from 'vitest';

import { multiplexer$, MultiplexerObj } from '@/src/multiplexer.js';
import { off$ } from '@/src/off.js';
import { once$ } from '@/src/once.js';
import { source$, SourceObj } from '@/src/source.js';

// Setup
let src: SourceObj<number>;
let mlt: MultiplexerObj<{ src: SourceObj<number> }>;

beforeEach(() => {
  src = source$();
  mlt = multiplexer$({ src });
});

describe('once$', () => {
  describe('on an observable', () => {
    it('should call listener and remove it', () => {
      const listener = vi.fn();
      once$(src, listener);

      src.next(1);
      src.next(1);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should join given off group', () => {
      const off = off$();
      vi.spyOn(off, 'add');

      const listener = vi.fn();

      expect(once$(src, listener, { off })).toBe(off);
      expect(off.add).toHaveBeenCalledTimes(1);

      off();
      src.next(1);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('on a listenable', () => {
    it('should call listener and remove it', () => {
      const listener = vi.fn();
      once$(mlt, 'src', listener);

      mlt.emit('src', 1);
      mlt.emit('src', 1);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should join given off group', () => {
      const off = off$();
      vi.spyOn(off, 'add');

      const listener = vi.fn();

      expect(once$(mlt, 'src', listener, { off })).toBe(off);
      expect(off.add).toHaveBeenCalledTimes(1);

      off();
      mlt.emit('src', 1);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
