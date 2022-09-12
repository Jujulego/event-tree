import { EventSource, joinKey, splitKey, waitForEvent } from '../src';

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
      .resolves.toEqual([
        true,
        { key: 'success', origin: source }
      ]);
  });
});
