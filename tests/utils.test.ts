import { EventSource, joinKey, splitKey, streamEvents, waitForEvent } from '../src';

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
describe('splitKey', () => {
  it('should divide key in parts', () => {
    expect(splitKey('a.b.c'))
      .toEqual(['a', 'b', 'c']);
  });
});

describe('joinKey', () => {
  it('should join key parts', () => {
    expect(joinKey('a', 'b', 'c'))
      .toBe('a.b.c');
  });

  it('should join key parts until undefined', () => {
    expect(joinKey('a', 'b', undefined, 'd', 'e'))
      .toBe('a.b');
  });
});

describe('waitForEvent', () => {
  it('should resolve when event is emitted', async () => {
    setTimeout(() => source.emit('success', true), 0);

    await expect(waitForEvent(source, 'success'))
      .resolves.toBe(true);
  });

  it('should reject when abort signal is emitted', async () => {
    const ctrl = new AbortController();

    setTimeout(() => ctrl.abort('Aborted !'), 0);

    await expect(waitForEvent(source, 'success', { signal: ctrl.signal }))
      .rejects.toBe('Aborted !');
  });
});

describe('streamEvents', () => {
  it('should generate every emitted event', async () => {
    const stream = streamEvents(source, 'result');

    // First event
    setTimeout(() => source.emit('result.s', 'toto'), 0);

    await expect(stream.next())
      .resolves.toEqual({ done: false, value: 'toto' });

    // Second event
    setTimeout(() => source.emit('result.n', 5), 0);

    await expect(stream.next())
      .resolves.toEqual({ done: false, value: 5 });
  });

  it('should reject when abort signal is emitted', async () => {
    const ctrl = new AbortController();
    const stream = streamEvents(source, 'result', { signal: ctrl.signal });

    setTimeout(() => ctrl.abort('Aborted !'), 0);

    await expect(stream.next())
      .rejects.toBe('Aborted !');
  });
});
