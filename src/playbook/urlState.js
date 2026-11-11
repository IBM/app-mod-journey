// Reading and writing the playbook state to the page URL, so a view can be shared as a link.

export const DEFAULT_DEPTH = 2;

function parsePrimaryIds(raw) {
  if (raw == null) {
    return [];
  }
  try {
    // Links made by the app are encoded once, older ones may have been encoded twice
    const ids = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(ids) ? ids : [];
  } catch (e) {
    return [];
  }
}

/** @param {string} search the value of window.location.search */
export function parseUrlState(search) {
  const params = new URLSearchParams(search);
  const depth = parseInt(params.get('depth'), 10);

  return {
    hasQuery: Boolean(search),
    showingAll: params.get('showingAll') === 'true',
    // Branches are shown unless the link explicitly hides them
    showingBranches: params.get('showingBranches') !== 'false',
    tocMode: params.get('tocMode') === 'true',
    initialDepth: Number.isNaN(depth) ? DEFAULT_DEPTH : depth,
    primaryIds: parsePrimaryIds(params.get('primaryData')),
  };
}

/** @returns {string} the query string, without the leading "?" */
export function buildUrlSearch({ showingAll, showingBranches, tocMode, initialDepth, primaryIds }) {
  return 'showingAll=' + showingAll + '&' +
    'showingBranches=' + showingBranches + '&' +
    'tocMode=' + tocMode + '&' +
    'depth=' + initialDepth + '&' +
    'primaryData=' + encodeURIComponent(JSON.stringify(primaryIds)) + '&';
}
