import { Group, group, Listener, Source, source } from '../src';

// Setup
let int: Source<number>;
let str: Source<string>;
let grp: Group<{ int: Source<number>, str: Source<string> }>;

beforeEach(() => {
  int = source();
  str = source();
  grp = group({ int, str });
});

// Tests
describe('group', () => {
  it('should emit child event', () => {
    jest.spyOn(int, 'emit');

    grp.emit('int', 1);

    expect(int.emit).toHaveBeenCalledWith(1);
  });

  it('should subscribe to child source', () => {
    jest.spyOn(int, 'subscribe');
    const listener = jest.fn();

    grp.on('int', listener);

    expect(int.subscribe).toHaveBeenCalledWith(listener);
  });

  it('should unsubscribe from child source', () => {
    jest.spyOn(int, 'unsubscribe');
    const listener = jest.fn();

    grp.off('int', listener);

    expect(int.unsubscribe).toHaveBeenCalledWith(listener);
  });

  it('should call group listener when emitting a child event', () => {
    const listener: Listener<number | string> = jest.fn();

    grp.subscribe(listener);
    grp.emit('int', 1);
    grp.emit('str', 'toto');

    expect(listener).toHaveBeenCalledWith(1);
    expect(listener).toHaveBeenCalledWith('toto');
  });

  it('should not call removed listeners (off method)', () => {
    const listener: Listener<number | string> = jest.fn();

    grp.subscribe(listener);
    grp.unsubscribe(listener);

    grp.emit('int', 1);
    grp.emit('str', 'toto');

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call removed listeners (returned off)', () => {
    const listener: Listener<number | string> = jest.fn();

    const off = grp.subscribe(listener);
    off();

    grp.emit('int', 1);
    grp.emit('str', 'toto');

    expect(listener).not.toHaveBeenCalled();
  });
});
