import { EventListener, EventRouter, EventSource } from '../src';

// Types
type TestEventMap = {
  'success': boolean;
  'result.s': string;
  'result.n': number;
}

// Setup
let source: EventSource<TestEventMap>;

beforeEach(() => {
  source = new EventSource();
});

// Tests
describe('EventSource', () => {
  it('should call listeners registered with exact key', () => {
    const listener = jest.fn();

    source.subscribe('result.n', listener);
    source.emit('result.n', 5);

    expect(listener).toHaveBeenCalledWith(5, { key: 'result.n', origin: source });
  });

  it('should call listeners registered with partial key', () => {
    const listener = jest.fn();

    source.subscribe('result', listener);
    source.emit('result.n', 5);

    expect(listener).toHaveBeenCalledWith(5, { key: 'result.n', origin: source });
  });

  it('should not call listeners registered with wrong key', () => {
    const listener = jest.fn();

    source.subscribe('success', listener);
    source.emit('result.n', 5);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call unsubscribed listeners', () => {
    const listener = jest.fn();

    const unsub = source.subscribe('result.n', listener);
    unsub();

    source.emit('result.n', 5);

    expect(listener).not.toHaveBeenCalled();
  });
});
