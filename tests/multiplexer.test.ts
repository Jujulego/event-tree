import { Multiplexer, multiplexer, Source, source } from '../src';

// Setup
let int: Source<number>;
let str: Source<string>;
let mlt: Multiplexer<{ int: Source<number>, str: Source<string> }>;

beforeEach(() => {
  int = source();
  str = source();
  mlt = multiplexer({ int, str });
});

// Tests
describe('multiplexer', () => {
  it('should emit child event', () => {
    jest.spyOn(int, 'emit');

    mlt.emit('int', 1);

    expect(int.emit).toHaveBeenCalledWith(1);
  });

  it('should subscribe to child source', () => {
    jest.spyOn(int, 'subscribe');
    const listener = jest.fn();

    mlt.on('int', listener);

    expect(int.subscribe).toHaveBeenCalledWith(listener);
  });

  it('should unsubscribe from child source', () => {
    jest.spyOn(int, 'unsubscribe');
    const listener = jest.fn();

    mlt.off('int', listener);

    expect(int.unsubscribe).toHaveBeenCalledWith(listener);
  });
});
