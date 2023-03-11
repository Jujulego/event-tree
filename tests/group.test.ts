import { Group, group, Listener, multiplexer, Multiplexer, Source, source } from '../src';

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
  it('should call group listener when emitting a child event', () => {
    const listener: Listener<number | string | boolean> = jest.fn();

    grp.subscribe(listener);
    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).toHaveBeenCalledWith(1);
    expect(listener).toHaveBeenCalledWith('toto');
    expect(listener).toHaveBeenCalledWith(true);
  });

  it('should not call removed listeners (off method)', () => {
    const listener: Listener<number | string | boolean> = jest.fn();

    grp.subscribe(listener);
    grp.unsubscribe(listener);

    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call removed listeners (returned off)', () => {
    const listener: Listener<number | string | boolean> = jest.fn();

    const off = grp.subscribe(listener);
    off();

    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).not.toHaveBeenCalled();
  });

  describe('emit', () => {
    it('should emit child event', () => {
      jest.spyOn(int, 'emit');

      grp.emit('int', 1);

      expect(int.emit).toHaveBeenCalledWith(1);
    });

    it('should emit deep child event', () => {
      jest.spyOn(boo, 'emit');

      grp.emit('deep.boo', true);

      expect(boo.emit).toHaveBeenCalledWith(true);
    });

    it('should not emit child event as child doesn\'t exists', () => {
      expect(() => grp.emit('toto' as 'int', 1))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      jest.spyOn(int, 'subscribe');
      const listener = jest.fn();

      grp.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      jest.spyOn(boo, 'subscribe');
      const listener = jest.fn();

      grp.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should not subscribe to child event as child doesn\'t exists', () => {
      expect(() => grp.on('toto' as 'int', jest.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      jest.spyOn(int, 'unsubscribe');
      const listener = jest.fn();

      grp.off('int', listener);

      expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      jest.spyOn(boo, 'unsubscribe');
      const listener = jest.fn();

      grp.off('deep.boo', listener);

      expect(boo.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should not unsubscribe from child event as child doesn\'t exists', () => {
      expect(() => grp.off('toto' as 'int', jest.fn()))
        .toThrow(new Error('Child source toto not found'));
    });
  });
});
