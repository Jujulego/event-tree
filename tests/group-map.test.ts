import { groupMap, IMultiplexer, ISource, Listener, multiplexer, source } from '../src';

// Tests
describe('groupMap', () => {
  it('should call group listener when emitting a child event', () => {
    const groupSpy: Listener<number> = jest.fn();
    const sourceSpy: Listener<number> = jest.fn();
    const src = source<number>();

    const builder = jest.fn(() => src);

    const grp = groupMap(builder);
    grp.subscribe(groupSpy);
    grp.on('life', sourceSpy);
    grp.emit('life', 42);

    expect(groupSpy).toHaveBeenCalledWith(42);
    expect(sourceSpy).toHaveBeenCalledWith(42);

    expect(builder).toHaveBeenCalledWith('life');
  });

  it('should call group listener when emitting a deep child event', () => {
    const groupSpy: Listener<number> = jest.fn();
    const deepSpy: Listener<number> = jest.fn();
    const deep = multiplexer({
      life: source<number>(),
    });

    const builder = jest.fn(() => deep);

    const grp = groupMap(builder);
    grp.subscribe(groupSpy);
    grp.on('deep.life', deepSpy);
    grp.emit('deep.life', 42);

    expect(groupSpy).toHaveBeenCalledWith(42);
    expect(deepSpy).toHaveBeenCalledWith(42);

    expect(builder).toHaveBeenCalledWith('deep');
  });
});
