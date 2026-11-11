// Pure helpers for the playbook decision tree.
// Entries are the flat records from ta-generate.json. Nothing here mutates its inputs.

export const ROOT_ID = 'A1';

export function cloneEntries(entries) {
  return JSON.parse(JSON.stringify(entries));
}

export function findEntryById(entries, id) {
  return entries.find(entry => entry.id === id) || null;
}

export function findEntryByName(entries, name) {
  return entries.find(entry => entry.name === name) || null;
}

function hasChildPointers(entry) {
  return Boolean(entry && entry.childPointers && entry.childPointers.length > 0);
}

/**
 * Build the nested tree react-d3-tree renders. Only primary (selected) entries are expanded,
 * their children are listed but stay collapsed to a single level unless they are primary too.
 * Always returns new objects, so a changed tree is a changed reference.
 */
export function buildTree(entries, rootId = ROOT_ID) {
  const byId = new Map(entries.map(entry => [entry.id, entry]));

  const expand = (entry) => {
    if (!entry.primary || !hasChildPointers(entry)) {
      return { ...entry };
    }
    return { ...entry, children: entry.childPointers.map(id => expand(byId.get(id))) };
  };

  return expand(byId.get(rootId));
}

/**
 * Select the named entry within its group (every other entry in the group is deselected).
 * Returns the same array when the name is unknown.
 */
export function setPrimaryInGroup(entries, name) {
  const selected = findEntryByName(entries, name);
  if (!selected) {
    return entries;
  }
  return entries.map(entry => (
    entry.groupId === selected.groupId ? { ...entry, primary: entry.id === selected.id } : entry
  ));
}

/** Keep only the selected entries, and drop pointers to the ones that were removed. */
export function pruneEntries(entries) {
  const kept = entries.filter(entry => entry.primary);
  const validIds = new Set(kept.map(entry => entry.id));
  return kept.map(entry => ({
    ...entry,
    childPointers: (entry.childPointers || []).filter(id => validIds.has(id)),
  }));
}

/** Ids of the selected nodes in a built tree, in depth-first order (this order is part of shared URLs). */
export function getPrimaryIds(tree) {
  const ids = [];
  const visit = (node) => {
    if (node.primary === true) {
      ids.push(node.id);
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(visit);
    }
  };
  visit(tree);
  return ids;
}

/** Find the 1-based depth of a named node within a built tree. */
export function getNodeDepth(tree, name, currentDepth = 1) {
  if (!tree) {
    return null;
  }
  if (tree.name === name) {
    return currentDepth;
  }
  if (Array.isArray(tree.children)) {
    for (const child of tree.children) {
      const found = getNodeDepth(child, name, currentDepth + 1);
      if (found !== null) {
        return found;
      }
    }
  }
  return null;
}
