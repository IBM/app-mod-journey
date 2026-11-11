import { buildUrlSearch, parseUrlState } from './urlState';

describe('parseUrlState', () => {
  test('uses the defaults for a plain visit', () => {
    expect(parseUrlState('')).toEqual({
      hasQuery: false,
      showingAll: false,
      showingBranches: true,
      tocMode: false,
      initialDepth: 2,
      primaryIds: [],
    });
  });

  test('reads every option from a link', () => {
    const state = parseUrlState(
      '?showingAll=true&showingBranches=false&tocMode=true&depth=3&primaryData=' +
      encodeURIComponent(JSON.stringify(['A1', 'B3']))
    );
    expect(state).toEqual({
      hasQuery: true,
      showingAll: true,
      showingBranches: false,
      tocMode: true,
      initialDepth: 3,
      primaryIds: ['A1', 'B3'],
    });
  });

  test('only an explicit false hides the branches', () => {
    expect(parseUrlState('?showingBranches=nonsense').showingBranches).toBe(true);
  });

  test('falls back to the default depth when it is not a number', () => {
    expect(parseUrlState('?depth=deep').initialDepth).toBe(2);
  });

  test('ignores a damaged selection instead of failing', () => {
    expect(parseUrlState('?primaryData=%5Bnot-json').primaryIds).toEqual([]);
    expect(parseUrlState('?primaryData=' + encodeURIComponent('{"a":1}')).primaryIds).toEqual([]);
  });
});

describe('buildUrlSearch', () => {
  const state = {
    showingAll: false, showingBranches: true, tocMode: false, initialDepth: 2, primaryIds: ['A1', 'B3'],
  };

  test('writes the format that shared links already use', () => {
    expect(buildUrlSearch(state)).toBe(
      'showingAll=false&showingBranches=true&tocMode=false&depth=2&primaryData=%5B%22A1%22%2C%22B3%22%5D&'
    );
  });

  test('reads back what it wrote', () => {
    const written = buildUrlSearch({ ...state, showingAll: true, tocMode: true, initialDepth: 50 });
    expect(parseUrlState('?' + written)).toMatchObject({
      showingAll: true, showingBranches: true, tocMode: true, initialDepth: 50, primaryIds: ['A1', 'B3'],
    });
  });
});
