import { EventSource, waitForEvent } from '../src';

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
