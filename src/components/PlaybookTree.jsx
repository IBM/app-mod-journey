import React from 'react';
import Tree from 'react-d3-tree';
import MixedNodeInputElement from './MixedNodeInputElement';
import useSvgAriaLabel from '../hooks/useSvgAriaLabel';

const NODE_SIZE = { x: 200, y: 150 };
const TREE_LABEL = 'Application modernization decision tree visualization';

// Fixed react-d3-tree settings
const TREE_CONFIG = {
  orientation: 'horizontal',
  centeringTransitionDuration: 800,
  collapsible: true,
  zoomable: true,
  draggable: true,
  zoom: 0.55,
  scaleExtent: { min: 0.1, max: 5 },
  separation: { siblings: 1.25, nonSiblings: 1.75 },
  nodeSize: NODE_SIZE,
  enableLegacyTransitions: false,
  transitionDuration: 500,
  depthFactor: 250,
  shouldCollapseNeighborNodes: false,
  styles: {
    nodes: {
      node: {
        circle: { fill: '#52e2c5' },
        attributes: { stroke: '#000' },
      },
      leafNode: {
        circle: { fill: 'transparent' },
        attributes: { stroke: '#000' },
      },
    },
  },
};

const logEvent = (name) => (...args) => console.log(name, args);

/** The decision tree. Clicking a node selects it, clicking its Videos link plays the video. */
export default function PlaybookTree({ containerRef, tree, translate, initialDepth, onSelectNode, onPlayVideo }) {
  useSvgAriaLabel('.tree-container svg', TREE_LABEL);

  // What the interactive node needs to read and change the playbook
  const appState = { data: tree, changePrimary: onSelectNode, playVideo: onPlayVideo };

  const renderNode = ({ nodeDatum, toggleNode }) => (
    <MixedNodeInputElement
      nodeData={nodeDatum}
      triggerNodeToggle={toggleNode}
      appState={appState}
      foreignObjectProps={{
        width: NODE_SIZE.x,
        height: NODE_SIZE.y,
        x: -50,
        y: 25,
      }}
    />
  );

  return (
    <div ref={containerRef} className="tree-container" role="img" aria-label={TREE_LABEL}>
      <Tree
        hasInteractiveNodes
        data={tree}
        renderCustomNodeElement={renderNode}
        rootNodeClassName="demo-node"
        branchNodeClassName="demo-node"
        translate={translate}
        initialDepth={initialDepth}
        {...TREE_CONFIG}
        onNodeClick={logEvent('onNodeClick')}
        onNodeMouseOver={logEvent('onNodeMouseOver')}
        onNodeMouseOut={logEvent('onNodeMouseOut')}
        onLinkClick={logEvent('onLinkClick')}
        onLinkMouseOver={logEvent('onLinkMouseOver')}
        onLinkMouseOut={logEvent('onLinkMouseOut')}
      />
    </div>
  );
}
