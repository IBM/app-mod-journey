import taGenerate from '../examples/ta-generate.json';
import { buildTree, cloneEntries, findEntryById, getNodeDepth, pruneEntries, setPrimaryInGroup } from './treeData';
import { DEFAULT_DEPTH, parseUrlState } from './urlState';

const EXPANDED_DEPTH = 50;

const initialEntries = cloneEntries(taGenerate.data);

export const initialPlaybookState = {
  entries: initialEntries, // working copy of the playbook entries, with the current selection
  hiddenEntries: null, // the entries as they were before "hide unselected nodes", so they can be restored
  tree: buildTree(initialEntries), // what react-d3-tree renders, a new object makes it re-render
  tocMode: false, // showing the table of contents instead of the tree
  showingAll: false,
  showingBranches: true,
  initialDepth: DEFAULT_DEPTH,
  depthBeforeShowAll: DEFAULT_DEPTH,
  translate: { x: 200, y: 200 },
  urlVersion: 0, // goes up on every change that should be written to the URL, 0 means leave the address bar alone
};

function hydrate(search, size) {
  const url = parseUrlState(search);

  let entries = cloneEntries(taGenerate.data);
  for (const id of url.primaryIds) {
    const entry = findEntryById(entries, id);
    if (entry) {
      entries = setPrimaryInGroup(entries, entry.name);
    }
  }

  let hiddenEntries = null;
  if (!url.showingBranches) {
    hiddenEntries = entries;
    entries = pruneEntries(entries);
  }

  const width = (size && size.width > 0) ? size.width : 800;
  const height = (size && size.height > 0) ? size.height : 600;

  return {
    ...initialPlaybookState,
    entries,
    hiddenEntries,
    tree: buildTree(entries),
    tocMode: url.tocMode,
    showingAll: url.showingAll,
    showingBranches: url.showingBranches,
    initialDepth: url.initialDepth,
    translate: { x: width / 25, y: height / 2.5 },
    urlVersion: url.hasQuery ? 1 : 0,
  };
}

export function playbookReducer(state, action) {
  switch (action.type) {
    // Start from the page URL and the size of the tree container
    case 'hydrate':
      return hydrate(action.search, action.size);

    // Select a node (and so deselect the others in its group). depth is optional.
    case 'selectNode': {
      const entries = setPrimaryInGroup(state.entries, action.name);
      if (entries === state.entries) {
        return state;
      }
      return {
        ...state,
        entries,
        tree: buildTree(entries),
        initialDepth: action.depth ?? state.initialDepth,
        urlVersion: state.urlVersion + 1,
      };
    }

    case 'toggleShowAll':
      return {
        ...state,
        showingAll: !state.showingAll,
        initialDepth: state.showingAll ? state.depthBeforeShowAll : EXPANDED_DEPTH,
        depthBeforeShowAll: state.initialDepth,
        tree: { ...state.tree }, // a new object makes the tree re-render at the new depth
        urlVersion: state.urlVersion + 1,
      };

    case 'toggleToc':
      return { ...state, tocMode: !state.tocMode, urlVersion: state.urlVersion + 1 };

    case 'toggleBranches': {
      if (state.showingBranches) {
        const entries = pruneEntries(state.entries);
        return {
          ...state,
          hiddenEntries: state.entries,
          entries,
          tree: buildTree(entries),
          showingBranches: false,
          urlVersion: state.urlVersion + 1,
        };
      }
      const entries = state.hiddenEntries || state.entries;
      return {
        ...state,
        hiddenEntries: null,
        entries,
        tree: buildTree(entries),
        showingBranches: true,
        urlVersion: state.urlVersion + 1,
      };
    }

    default:
      return state;
  }
}
