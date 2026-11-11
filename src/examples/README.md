# Examples & Sample Data

This directory contains reference implementations for custom `react-d3-tree` node elements and dataset files used by the application modernization playbook.

---

## Example Node Components

These files provide generic reference patterns for rendering custom nodes in `react-d3-tree`. They are not imported in production and serve as developer documentation and starting points for alternative node designs.

### [`MixedNodeElement.js`](./MixedNodeElement.js)
Demonstrates rendering an HTML card inside an SVG tree using `<foreignObject>`.
- **Use case:** Rich HTML/CSS styling inside SVG node boundaries, collapse/expand toggle buttons, and dynamic attribute lists.
- **Usage example:**
  ```jsx
  import Tree from 'react-d3-tree';
  import MixedNodeElement from './examples/MixedNodeElement';

  <Tree
    data={myTreeData}
    renderCustomNodeElement={(rd3tProps) => (
      <MixedNodeElement
        nodeData={rd3tProps.nodeDatum}
        triggerNodeToggle={rd3tProps.toggleNode}
        foreignObjectProps={{ width: 200, height: 150, x: -50, y: 25 }}
      />
    )}
  />
  ```

### [`PureSvgNodeElement.js`](./PureSvgNodeElement.js)
Demonstrates rendering pure SVG text and shapes without `<foreignObject>`.
- **Use case:** Lightweight rendering, environments without full `<foreignObject>` support, or SVG-only exports.
- **Usage example:**
  ```jsx
  import Tree from 'react-d3-tree';
  import PureSvgNodeElement from './examples/PureSvgNodeElement';

  <Tree
    data={myTreeData}
    orientation="horizontal"
    renderCustomNodeElement={(rd3tProps) => (
      <PureSvgNodeElement
        nodeDatum={rd3tProps.nodeDatum}
        orientation="horizontal"
        toggleNode={rd3tProps.toggleNode}
        onNodeClick={() => console.log('Node clicked', rd3tProps.nodeDatum)}
      />
    )}
  />
  ```

---

## Data Files

- **[`ta-generate.json`](./ta-generate.json)**: The active production dataset containing the flat node records, parent/child pointers, and Table of Contents section groupings.
- **[`org-chart.json.bck`](./org-chart.json.bck)**: Sample hierarchical dataset for reference.

---

## Production Counterpart

For the active production implementation of interactive tree nodes (which includes node selection, hover description popups, and video modal links), see [`src/components/MixedNodeInputElement.js`](../components/MixedNodeInputElement.js).
