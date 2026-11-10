import taGenerate from '../examples/ta-generate.json';
import { buildTree, cloneEntries, getNodeDepth, getPrimaryIds, pruneEntries, setPrimaryInGroup } from './treeData';

// root -> (a1 | a2) in group "A"; a1 -> (b1 | b2) in group "B"
const fixture = () => [
  { id: 'R', name: 'root', groupId: 'R', primary: true, childPointers: ['a1', 'a2'] },
  { id: 'a1', name: 'first', groupId: 'A', primary: true, childPointers: ['b1', 'b2'] },
  { id: 'a2', name: 'second', groupId: 'A', primary: false, childPointers: ['b3'] },
  { id: 'b1', name: 'leaf one', groupId: 'B', primary: true },
  { id: 'b2', name: 'leaf two', groupId: 'B', primary: false },
  { id: 'b3', name: 'leaf three', groupId: 'C', primary: false },
];

describe('buildTree', () => {
  const entries = fixture();
  const tree = buildTree(entries, 'R');

  test('expands selected entries and lists the children of each', () => {
    expect(tree.children.map(c => c.id)).toEqual(['a1', 'a2']);
    expect(tree.children[0].children.map(c => c.id)).toEqual(['b1', 'b2']);
  });

  test('does not expand entries that are not selected', () => {
    expect(tree.children[1].children).toBeUndefined();
  });

  test('does not change the entries it is given', () => {
    expect(entries).toEqual(fixture());
  });

  test('returns new objects every time, so a changed tree is a changed reference', () => {
    expect(buildTree(entries, 'R')).not.toBe(tree);
  });
});

describe('setPrimaryInGroup', () => {
  test('selects the named entry and deselects the others in its group', () => {
    const next = setPrimaryInGroup(fixture(), 'second');
    expect(next.find(e => e.id === 'a2').primary).toBe(true);
    expect(next.find(e => e.id === 'a1').primary).toBe(false);
  });

  test('leaves other groups alone', () => {
    const next = setPrimaryInGroup(fixture(), 'second');
    expect(next.find(e => e.id === 'b1').primary).toBe(true);
    expect(next.find(e => e.id === 'R').primary).toBe(true);
  });

  test('does not change the entries it is given', () => {
    const entries = fixture();
    setPrimaryInGroup(entries, 'second');
    expect(entries).toEqual(fixture());
  });

  test('returns the same array for an unknown name', () => {
    const entries = fixture();
    expect(setPrimaryInGroup(entries, 'nope')).toBe(entries);
  });
});

describe('pruneEntries', () => {
  const pruned = pruneEntries(fixture());

  test('keeps only selected entries', () => {
    expect(pruned.map(e => e.id)).toEqual(['R', 'a1', 'b1']);
  });

  test('drops pointers to the removed entries', () => {
    expect(pruned.find(e => e.id === 'R').childPointers).toEqual(['a1']);
    expect(pruned.find(e => e.id === 'a1').childPointers).toEqual(['b1']);
  });

  test('gives entries without pointers an empty list', () => {
    expect(pruned.find(e => e.id === 'b1').childPointers).toEqual([]);
  });

  test('leaves no stale children behind when the tree is rebuilt', () => {
    expect(buildTree(pruned, 'R').children[0].children[0].children).toBeUndefined();
  });
});

describe('getPrimaryIds', () => {
  test('lists the selected nodes depth first', () => {
    expect(getPrimaryIds(buildTree(fixture(), 'R'))).toEqual(['R', 'a1', 'b1']);
  });
});

describe('getNodeDepth', () => {
  const tree = buildTree(fixture(), 'R');

  test('returns 1 for root', () => {
    expect(getNodeDepth(tree, 'root')).toBe(1);
  });

  test('returns 2 for direct children', () => {
    expect(getNodeDepth(tree, 'first')).toBe(2);
    expect(getNodeDepth(tree, 'second')).toBe(2);
  });

  test('returns 3 for grandchild', () => {
    expect(getNodeDepth(tree, 'leaf one')).toBe(3);
  });

  test('returns null for non-existent node', () => {
    expect(getNodeDepth(tree, 'non-existent')).toBeNull();
  });
});

describe('the real playbook data', () => {
  const entries = cloneEntries(taGenerate.data);

  test('every pointer resolves to an entry', () => {
    const ids = new Set(entries.map(e => e.id));
    const dangling = entries.flatMap(e => (e.childPointers || []).filter(id => !ids.has(id)));
    expect(dangling).toEqual([]);
  });

  test('ids and names are unique, as selecting by name relies on it', () => {
    expect(new Set(entries.map(e => e.id)).size).toBe(entries.length);
    expect(new Set(entries.map(e => e.name)).size).toBe(entries.length);
  });

  test('the default view selects the path that shared links are written with', () => {
    expect(getPrimaryIds(buildTree(entries))).toEqual(
      ['A1', 'B3', 'C4', 'D2', 'E4', 'F4', 'G1', 'H4', 'G2', 'H1', 'J1', 'K1']
    );
  });

  test('hiding unselected entries leaves only the selected path', () => {
    const pruned = pruneEntries(entries);
    expect(pruned.every(e => e.primary)).toBe(true);
    expect(pruned).toHaveLength(15);
  });
});
