import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';
import { getPrimaryIds } from '../playbook/treeData';
import { initialPlaybookState, playbookReducer } from '../playbook/playbookReducer';
import { buildUrlSearch } from '../playbook/urlState';

/**
 * State for the playbook: the selected path through the decision tree, the view options,
 * and keeping the page URL in step with them so a view can be shared as a link.
 *
 * Attach `treeContainer` to the element that holds the tree, it is measured once on mount
 * to position the tree.
 */
export default function usePlaybook() {
  const [state, dispatch] = useReducer(playbookReducer, initialPlaybookState);
  const treeContainer = useRef(null);

  // Start from the page URL. A layout effect, so the first paint is already the real tree.
  useLayoutEffect(() => {
    const { width, height } = treeContainer.current.getBoundingClientRect();
    dispatch({ type: 'hydrate', search: window.location.search, size: { width, height } });
  }, []);

  const { urlVersion, showingAll, showingBranches, tocMode, initialDepth, tree } = state;
  useEffect(() => {
    if (urlVersion === 0) {
      return; // nothing has changed yet, leave the address bar alone
    }
    const baseURL = window.location.origin + window.location.pathname;
    const search = buildUrlSearch({
      showingAll, showingBranches, tocMode, initialDepth, primaryIds: getPrimaryIds(tree),
    });
    window.history.pushState({}, 'Test', baseURL + '?' + search);
  }, [urlVersion, showingAll, showingBranches, tocMode, initialDepth, tree]);

  return {
    state,
    treeContainer,
    selectNode: (name, depth) => dispatch({ type: 'selectNode', name, depth }),
    toggleShowAll: () => dispatch({ type: 'toggleShowAll' }),
    toggleToc: () => dispatch({ type: 'toggleToc' }),
    toggleBranches: () => dispatch({ type: 'toggleBranches' }),
  };
}
