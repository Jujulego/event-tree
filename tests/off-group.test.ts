import { vi } from 'vitest';

import { offGroup } from '@/src';

// Tests
describe('offGroup', () => {
  it('should call grouped functions', () => {
    const spy1 = vi.fn();
    const spy2 = vi.fn();

    const grp = offGroup(spy1);
    grp.add(spy2);

    grp();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  it('should call also added other group (add)', () => {
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();

    const grp = offGroup(spy1, spy2);
    grp.add(offGroup(spy3));

    grp();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
  });

  it('should call also added other group (init)', () => {
    const spy1 = vi.fn();
    const spy2 = vi.fn();
    const spy3 = vi.fn();

    const grp = offGroup(spy1, spy2, offGroup(spy3));

    grp();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
  });
});
