import { ListenerTree } from '../src';

// Types
type TestEventMap = {
  'success': boolean;
  'result.s': string;
  'result.n': number;
}

// Setup
let tree: ListenerTree<TestEventMap>;

beforeEach(() => {
  tree = new ListenerTree();
});

// Tests
describe('ListenerTree', () => {
  it('should yield listener inserted with exact key', () => {
    const listener = jest.fn();
    tree.insert('success', listener);

    expect(Array.from(tree.search('success')))
      .toEqual([listener]);
  });

  it('should yield listener inserted with partial key', () => {
    const l1 = jest.fn();
    const l2 = jest.fn();

    tree.insert('result', l1);
    tree.insert('result.n', l2);

    expect(Array.from(tree.search('result.n')))
      .toEqual([l1, l2]);
  });

  it('should not yield listener inserted with wrong key', () => {
    const listener = jest.fn();
    tree.insert('result', listener);

    expect(Array.from(tree.search('success')))
      .toEqual([]);
  });

  it('should not yield a removed listener', () => {
    const l1 = jest.fn();
    const l2 = jest.fn();

    tree.insert('result', l1);
    tree.insert('result.n', l2);

    tree.remove('result', l1);

    expect(Array.from(tree.search('result.n')))
      .toEqual([l2]);
  });
});
