import { initialPlaybookState, playbookReducer } from './playbookReducer';
import { getPrimaryIds } from './treeData';

const size = { width: 1000, height: 500 };
const hydrate = (search = '') => playbookReducer(initialPlaybookState, { type: 'hydrate', search, size });
const primaries = state => getPrimaryIds(state.tree);

describe('hydrate', () => {
  test('a plain visit shows the default path and leaves the address bar alone', () => {
    const state = hydrate();
    expect(primaries(state)).toEqual(['A1', 'B3', 'C4', 'D2', 'E4', 'F4', 'G1', 'H4', 'G2', 'H1', 'J1', 'K1']);
    expect(state.urlVersion).toBe(0);
    expect(state.initialDepth).toBe(2);
  });

  test('positions the tree from the size of its container', () => {
    expect(hydrate().translate).toEqual({ x: 40, y: 200 });
  });

  test('a shared link restores the selection and the view options, and is written back', () => {
    const link = '?showingAll=true&tocMode=true&depth=3&primaryData=' +
      encodeURIComponent(JSON.stringify(['A1', 'B3', 'C2']));
    const state = hydrate(link);
    expect(primaries(state)).toContain('C2');
    expect(primaries(state)).not.toContain('C4');
    expect(state).toMatchObject({ showingAll: true, tocMode: true, initialDepth: 3 });
    expect(state.urlVersion).toBeGreaterThan(0);
  });

  test('ignores ids that are not in the playbook', () => {
    const link = '?primaryData=' + encodeURIComponent(JSON.stringify(['A1', 'ZZ9']));
    expect(primaries(hydrate(link))).toEqual(primaries(hydrate()));
  });

  test('a link that hides the branches keeps its selection and can restore the rest', () => {
    const link = '?showingBranches=false&primaryData=' + encodeURIComponent(JSON.stringify(['A1', 'B2']));
    const hidden = hydrate(link);
    expect(hidden.showingBranches).toBe(false);
    expect(hidden.entries.every(e => e.primary)).toBe(true);

    const shown = playbookReducer(hidden, { type: 'toggleBranches' });
    expect(shown.entries.length).toBeGreaterThan(hidden.entries.length);
    expect(primaries(shown)).toContain('B2');
    expect(primaries(shown)).not.toContain('B3');
  });
});

describe('selectNode', () => {
  test('moves the selection within the group', () => {
    const state = playbookReducer(hydrate(), { type: 'selectNode', name: 'from Liberty' });
    expect(primaries(state)).toContain('B2');
    expect(primaries(state)).not.toContain('B3');
  });

  test('sets the depth when it is given, and keeps it when it is not', () => {
    expect(playbookReducer(hydrate(), { type: 'selectNode', name: 'from Liberty', depth: 4 }).initialDepth).toBe(4);
    expect(playbookReducer(hydrate(), { type: 'selectNode', name: 'from Liberty' }).initialDepth).toBe(2);
  });

  test('builds a new tree, so the view re-renders', () => {
    const before = hydrate();
    expect(playbookReducer(before, { type: 'selectNode', name: 'from Liberty' }).tree).not.toBe(before.tree);
  });

  test('is written to the URL', () => {
    const before = hydrate();
    expect(playbookReducer(before, { type: 'selectNode', name: 'from Liberty' }).urlVersion)
      .toBeGreaterThan(before.urlVersion);
  });

  test('an unknown name changes nothing', () => {
    const before = hydrate();
    expect(playbookReducer(before, { type: 'selectNode', name: 'nope' })).toBe(before);
  });

  test('does not change the playbook data that other code imports', () => {
    const before = JSON.stringify(require('../examples/ta-generate.json'));
    playbookReducer(hydrate(), { type: 'selectNode', name: 'from Liberty' });
    playbookReducer(playbookReducer(hydrate(), { type: 'toggleBranches' }), { type: 'toggleBranches' });
    expect(JSON.stringify(require('../examples/ta-generate.json'))).toBe(before);
  });
});

describe('toggleShowAll', () => {
  test('expands, remembering the depth to go back to', () => {
    const expanded = playbookReducer(hydrate(), { type: 'toggleShowAll' });
    expect(expanded).toMatchObject({ showingAll: true, initialDepth: 50, depthBeforeShowAll: 2 });
  });

  test('collapses back to the earlier depth', () => {
    const collapsed = [{ type: 'toggleShowAll' }, { type: 'toggleShowAll' }].reduce(playbookReducer, hydrate());
    expect(collapsed).toMatchObject({ showingAll: false, initialDepth: 2 });
  });

  test('keeps the depth reached by selecting a deeper node', () => {
    const state = [
      { type: 'selectNode', name: 'using Binary Scanner', depth: 3 },
      { type: 'toggleShowAll' },
      { type: 'toggleShowAll' },
    ].reduce(playbookReducer, hydrate());
    expect(state.initialDepth).toBe(3);
  });

  test('gives the tree a new reference, so it re-renders at the new depth', () => {
    const before = hydrate();
    const after = playbookReducer(before, { type: 'toggleShowAll' });
    expect(after.tree).not.toBe(before.tree);
    expect(after.tree).toEqual(before.tree);
  });
});

describe('toggleBranches', () => {
  test('hides the unselected entries, then brings them back', () => {
    const start = hydrate();
    const hidden = playbookReducer(start, { type: 'toggleBranches' });
    expect(hidden.showingBranches).toBe(false);
    expect(hidden.entries).toHaveLength(15);

    const shown = playbookReducer(hidden, { type: 'toggleBranches' });
    expect(shown.showingBranches).toBe(true);
    expect(shown.entries).toEqual(start.entries);
  });

  test('keeps the selection when they come back', () => {
    const state = [
      { type: 'selectNode', name: 'using Binary Scanner' },
      { type: 'toggleBranches' },
      { type: 'toggleBranches' },
    ].reduce(playbookReducer, hydrate());
    expect(primaries(state)).toContain('C2');
    expect(primaries(state)).not.toContain('C4');
  });

  test('a node that is hidden cannot be selected', () => {
    const hidden = playbookReducer(hydrate(), { type: 'toggleBranches' });
    expect(playbookReducer(hidden, { type: 'selectNode', name: 'using Binary Scanner' })).toBe(hidden);
  });

  test('expanding while hidden does not bring hidden nodes back', () => {
    const state = [{ type: 'toggleBranches' }, { type: 'toggleShowAll' }].reduce(playbookReducer, hydrate());
    expect(JSON.stringify(state.tree)).not.toContain('"L1"');
  });
});

describe('toggleToc', () => {
  test('switches between the table of contents and the tree', () => {
    const toc = playbookReducer(hydrate(), { type: 'toggleToc' });
    expect(toc.tocMode).toBe(true);
    expect(playbookReducer(toc, { type: 'toggleToc' }).tocMode).toBe(false);
  });
});

test('an unknown action changes nothing', () => {
  const state = hydrate();
  expect(playbookReducer(state, { type: 'nope' })).toBe(state);
});
