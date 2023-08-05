import { vi } from 'vitest';

import { groupMap, Listener, multiplexer, source } from '@/src';

// Tests
describe('groupMap', () => {
  it('should call group listener when emitting a child event', () => {
    const groupSpy: Listener<number> = vi.fn();
    const sourceSpy: Listener<number> = vi.fn();
    const src = source<number>();

    const builder = vi.fn(() => src);

    const grp = groupMap(builder);
    grp.subscribe(groupSpy);
    grp.on('life', sourceSpy);
    grp.emit('life', 42);

    expect(groupSpy).toHaveBeenCalledWith(42);
    expect(sourceSpy).toHaveBeenCalledWith(42);

    expect(builder).toHaveBeenCalledWith('life');
  });

  it('should call group listener when emitting a deep child event', () => {
    const groupSpy: Listener<number> = vi.fn();
    const deepSpy: Listener<number> = vi.fn();
    const deep = multiplexer({
      life: source<number>(),
    });

    const builder = vi.fn(() => deep);

    const grp = groupMap(builder);
    grp.subscribe(groupSpy);
    grp.on('deep.life', deepSpy);
    grp.emit('deep.life', 42);

    expect(groupSpy).toHaveBeenCalledWith(42);
    expect(deepSpy).toHaveBeenCalledWith(42);

    expect(builder).toHaveBeenCalledWith('deep');
  });
});
