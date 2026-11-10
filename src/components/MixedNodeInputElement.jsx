import React, { useState } from 'react';
import VideoLink from './VideoLink';

// Shared across all rendered nodes so only one description timer runs at a time
let descriptionTimerInfo = {timerId: null, nodeName: ''};

// Search for a node in this tree branch, returning null if it is not found
function findNodeInTree(treeNode, name, depth) {
  if (treeNode !== null) {
    const treeBranch = treeNode.children;
    // check the name
    for (let i = 0; i < treeBranch.length; i++) {
      if (treeBranch[i].name === name) {
        const matchedNode = treeBranch[i];
        return {matchedNode, depth};
      }
    }
    // check for children in the branch
    for (let i = 0; i < treeBranch.length; i++) {
      if (treeBranch[i].children && treeBranch[i].children.length > 0) {
        depth++;
        return findNodeInTree(treeBranch[i], name, depth);
      }
    }
  }
  return null;
}

// Find the node with this name in the tree, then make it the primary node
function selectNodeByName(appState, data, name) {
  let matchedNode = null;
  let depth = 50;
  let initialDepth = 1; // If we ask for a node that is not there, make sure we can break the loop
  while (matchedNode === null && initialDepth < 50) {
    initialDepth++;
    const matchingObject = findNodeInTree(data, name, initialDepth);
    matchedNode = matchingObject.matchedNode;
    depth = matchingObject.depth;
  }
  appState.changePrimary(name, depth);
}

/**
 * Interactive tree node. Clicking the node makes it the primary node.
 *
 * @param {Object} props
 * @param {Object} props.appState App state, used to read the tree and update the primary node
 * @param {Object} props.nodeData react-d3-tree node datum
 * @param {Object} props.foreignObjectProps size and position of the label
 */
function MixedNodeElement({appState, nodeData = {}, foreignObjectProps = {}}) {
  const [showDescription, setShowDescription] = useState(false);

  // When we enter the node we give a short delay then we pop up a description
  const nodeMouseEnter = () => {
    if (nodeData) {
      // If we already are running a timer for the description for this node then do nothing
      if (nodeData.name === descriptionTimerInfo.nodeName) {
        return;
      }
      const timerId = setTimeout(() => {
        // NOTE: DESCRIPTIONS ARE TURNED OFF FOR NOW, SO THIS IS HARDCODED TO FALSE
        // TODO: TURN BACK ON AND MAKE THEM LOOK NICE!!
        setShowDescription(false);
        // Now this is where I pop up the dialog or something
      }, 800);
      descriptionTimerInfo = {timerId, nodeName: nodeData.name};
    }
  };

  const nodeMouseLeave = () => {
    if (descriptionTimerInfo != null && descriptionTimerInfo.timerId != null) {
      clearTimeout(descriptionTimerInfo.timerId);
      descriptionTimerInfo = {timerId: null, nodeName: ''};
      if (showDescription) {
        setShowDescription(false);
      }
    }
  };

  const nodeClick = () => selectNodeByName(appState, appState.data, nodeData.name);

  const nodeNameFontSize = nodeData.name.length > 35 ? '22px' : '25px';

  return (
    <React.Fragment>
      <circle fill={'white'} r={20} onClick={nodeClick} onMouseEnter={nodeMouseEnter} onMouseLeave={nodeMouseLeave}></circle>

      <foreignObject {...foreignObjectProps} >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '1px solid white',
            paddingBottom: '1rem'
          }}
        >
          <div className='node-textContainer' style={{backgroundColor: 'white'}}>
            <span onClick={nodeClick} onMouseEnter={nodeMouseEnter}
                  onMouseLeave={nodeMouseLeave} style={{
              backgroundColor: 'white',
              color: nodeData.primary ? 'black' : 'grey',
              fontWeight: nodeData.primary ? '700' : '400',
              fontSize: nodeNameFontSize
            }}>{nodeData.name}</span>
            <div style={{backgroundColor: 'white'}}>
              <span style={{fontSize: 22, fontWeight: 500}}>{nodeData.docs ? (
                <a target='_blank' rel='noopener noreferrer' href={nodeData.docs}>Docs</a>) : ''}</span>
              <span
                style={{fontSize: 22, fontWeight: 500}}> {(nodeData.docs && nodeData.videos) ? ('|') : ''} </span>
              <span style={{fontSize: 22, fontWeight: 500}}>{nodeData.videos ? (
                <VideoLink url={nodeData.videos} onPlay={appState.playVideo}>Videos</VideoLink>) : ''}</span>
            </div>
          </div>
        </div>
      </foreignObject>

      {/* WATCH OUT!! If you pop the tooltip so that is covers the mouse it will trigger the mouseLeave and you get a flickering loop*/}
      {showDescription ?
        <foreignObject width={300} height={200} x={-150} y={-225}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid black',
              paddingBottom: '1rem',
              backgroundColor: 'rgb(248, 248, 255)' // ghostwhite
            }}
          >
            <span style={{color: 'black', fontWeight: '400', fontSize: '20px'}}>
              <p>{nodeData.description ? nodeData.description : nodeData.name}</p>
            </span>
          </div>
        </foreignObject>
        :
        null
      }
    </React.Fragment>
  );
}

export default MixedNodeElement;
