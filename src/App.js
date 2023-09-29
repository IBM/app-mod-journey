import React, { Component } from 'react';
import clone from 'clone';
import Tree from 'react-d3-tree';
import { version } from 'react-d3-tree/package.json';
import Switch from './components/Switch';
import MixedNodeElement from './components/MixedNodeElement';
import PureSvgNodeElement from './components/PureSvgNodeElement';
import MixedNodeInputElement from './components/MixedNodeInputElement';
import Header from './components/Header/Header';
import './App.css';

// Data examples
import orgChartJson from './examples/org-chart.json.bck';
import taGenerate from './examples/ta-generate.json';
import {TableOfContents} from '@carbon/icons-react';

import Modal from 'react-modal';

console.log('Demo React version: ', React.version);

const customModalStyles = {
  overlay: {
    backgroundColor: '#000'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  },
};

const customNodeFnMapping = {
  svg: {
    description: 'Default - Pure SVG node & label (IE11 compatible)',
    fn: (rd3tProps, appState) => (
      <PureSvgNodeElement
        nodeDatum={rd3tProps.nodeDatum}
        toggleNode={rd3tProps.toggleNode}
        orientation={appState.orientation}
      />
    ),
  },
  mixed: {
    description: 'MixedNodeElement - SVG `circle` + `foreignObject` label',
    fn: ({ nodeDatum, toggleNode }, appState) => (
      <MixedNodeElement
        nodeData={nodeDatum}
        triggerNodeToggle={toggleNode}
        foreignObjectProps={{
          width: appState.nodeSize.x,
          height: appState.nodeSize.y,
          x: -50,
          y: 50,
        }}
      />
    ),
  },
  input: {
    description: 'MixedNodeElement - Interactive nodes with inputs',
    fn: ({ nodeDatum, toggleNode }, appState) => (
      <MixedNodeInputElement
        nodeData={nodeDatum}
        triggerNodeToggle={toggleNode}
        appState={appState}
        foreignObjectProps={{
          width: appState.nodeSize.x,
          height: appState.nodeSize.y,
          x: -50,
          y: 25,
        }}
      />
    ),
  },
};

const countNodes = (count = 0, n) => {
  // Count the current node
  count += 1;

  // Base case: reached a leaf node.
  if (!n.children) {
    return count;
  }

  // Keep traversing children while updating `count` until we reach the base case.
  return n.children.reduce((sum, child) => countNodes(sum, child), count);
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

class App extends Component {
  constructor() {
    super();

    this.addedNodesCount = 0;

    this.setTreeData = this.setTreeData.bind(this);
    this.setActionSentence = this.setActionSentence.bind(this);
    this.generateTreeData = this.generateTreeData.bind(this);
    this.changePrimaryInGroupAndReload = this.changePrimaryInGroupAndReload.bind(this);
    this.pruneBranches = this.pruneBranches.bind(this);
    this.restoreBranches = this.restoreBranches.bind(this);
    this.showBranches = this.showBranches.bind(this);

    this.state = {
      tocMode: false, //Table of contents mode
      data: { name: 'initial'},
      taGenerateBackup: {},
      updateTree: this.setTreeData,
      changePrimary: this.changePrimaryInGroupAndReload,
      updateActionSentence: this.setActionSentence,
      totalNodeCount: countNodes(0, Array.isArray(orgChartJson) ? orgChartJson[0] : orgChartJson),
      orientation: 'horizontal',
      dimensions: undefined,
      centeringTransitionDuration: 800,
      translateX: 200,
      translateY: 200,
      collapsible: true,
      shouldCollapseNeighborNodes: false,
      initialDepth: 2,
      depthFactor: 250,
      zoomable: true,
      draggable: true,
      zoom: 0.55,
      scaleExtent: { min: 0.1, max: 5 },
      separation: { siblings: 1.25, nonSiblings: 1.75 },
      nodeSize: { x: 200, y: 150 },
      enableLegacyTransitions: false,
      transitionDuration: 500,
      renderCustomNodeElement: customNodeFnMapping['input'].fn,
      showingBranches: true,
      showingAll: false,
      showDialog: false,
      closeModal: this.closeModal,
      actionSentence: [],
      styles: {
        nodes: {
          node: {
            circle: {
              fill: '#52e2c5',
            },
            attributes: {
              stroke: '#000',
            },
          },
          leafNode: {
            circle: {
              fill: 'transparent',
            },
            attributes: {
              stroke: '#000',
            },
          },
        },
      },
    };

    this.setLargeTree = this.setLargeTree.bind(this);
    this.setOrientation = this.setOrientation.bind(this);
    this.setPathFunc = this.setPathFunc.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFloatChange = this.handleFloatChange.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this);
    this.toggleZoomable = this.toggleZoomable.bind(this);
    this.toggleDraggable = this.toggleDraggable.bind(this);
    this.toggleCenterNodes = this.toggleCenterNodes.bind(this);
    this.setScaleExtent = this.setScaleExtent.bind(this);
    this.setSeparation = this.setSeparation.bind(this);
    this.setNodeSize = this.setNodeSize.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal = () => {
    this.setState({showDialog: false});
  };

  showModal = () => {
    this.setState({showDialog: true});
  };

  setTreeData(data) {
    this.setState({
      data/*,
      totalNodeCount: countNodes(0, Array.isArray(data) ? data[0] : data),*/
    });
  }

  setActionSentence(actionSentence) {
    this.setState({
      actionSentence
    });
  }

  setLargeTree(data) {
    this.setState({
      data,
      transitionDuration: 0,
    });
  }

  setOrientation(orientation) {
    this.setState({ orientation });
  }

  setPathFunc(pathFunc) {
    this.setState({ pathFunc });
  }

  handleChange(evt) {
    const target = evt.target;
    const parsedIntValue = parseInt(target.value, 10);
    if (target.value === '') {
      this.setState({
        [target.name]: undefined,
      });
    } else if (!isNaN(parsedIntValue)) {
      this.setState({
        [target.name]: parsedIntValue,
      });
    }
  }

  handleFloatChange(evt) {
    const target = evt.target;
    const parsedFloatValue = parseFloat(target.value);
    if (target.value === '') {
      this.setState({
        [target.name]: undefined,
      });
    } else if (!isNaN(parsedFloatValue)) {
      this.setState({
        [target.name]: parsedFloatValue,
      });
    }
  }

  handleCustomNodeFnChange = evt => {
    const customNodeKey = evt.target.value;

    this.setState({ renderCustomNodeElement: customNodeFnMapping[customNodeKey].fn });
  };

  toggleCollapsible() {
    this.setState(prevState => ({ collapsible: !prevState.collapsible }));
  }

  toggleCollapseNeighborNodes = () => {
    this.setState(prevState => ({
      shouldCollapseNeighborNodes: !prevState.shouldCollapseNeighborNodes,
    }));
  };

  toggleZoomable() {
    this.setState(prevState => ({ zoomable: !prevState.zoomable }));
  }

  toggleDraggable() {
    this.setState(prevState => ({ draggable: !prevState.draggable }));
  }

  toggleCenterNodes() {
    if (this.state.dimensions !== undefined) {
      this.setState({
        dimensions: undefined,
      });
    } else {
      if (this.treeContainer) {
        const { width, height } = this.treeContainer.getBoundingClientRect();
        this.setState({
          dimensions: {
            width,
            height,
          },
        });
      }
    }
  }

  setScaleExtent(scaleExtent) {
    this.setState({ scaleExtent });
  }

  setSeparation(separation) {
    if (!isNaN(separation.siblings) && !isNaN(separation.nonSiblings)) {
      this.setState({ separation });
    }
  }

  setNodeSize(nodeSize) {
    if (!isNaN(nodeSize.x) && !isNaN(nodeSize.y)) {
      this.setState({ nodeSize });
    }
  }

  addChildNode = () => {
    const data = clone(this.state.data);
    const target = data[0].children ? data[0].children : data[0]._children;
    this.addedNodesCount++;
    target.push({
      name: `Inserted Node ${this.addedNodesCount}`,
      id: `inserted-node-${this.addedNodesCount}`,
    });
    this.setState({
      data,
    });
  };

  removeChildNode = () => {
    const data = clone(this.state.data);
    const target = data[0].children ? data[0].children : data[0]._children;
    target.pop();
    this.addedNodesCount--;
    this.setState({
      data,
    });
  };

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translateX: dimensions.width / 25,
      translateY: dimensions.height / 2.5,
    });
    this.setTreeData(this.populateAllTreeData(this.getEntryFromGeneratedData("A1")));
  }

  showToc() {
    this.setState({tocMode: !this.state.tocMode});
  }

  getSectionNameFromGroupId(groupId) {
    for(let section of taGenerate.tocSections) {
      if(section.groupId === groupId) {
        return section.name
      }
    }
    return null;
  }

  generateToc() {
    if(!this.state.tocMode) {
      return null;
    }

    let sectionSet = new Set(taGenerate.tocSections);
    let groupSet = new Set();
    let generatedTOC = [];
    generatedTOC.push(<div className={'h1-heading'}>
      <TableOfContents size={'20px'} />
      <span style={{marginLeft:'5px'}}>Table of Contents</span></div>);
    for(let entry of taGenerate.data) {
      //Check if this is teh first entry for the group,a nd add the heading for the group if it is
      if(!groupSet.has(entry.groupId)) {
        generatedTOC.push(<div className={'h2-heading'}>{this.getSectionNameFromGroupId(entry.groupId)}</div>);
        groupSet.add(entry.groupId);
      }

      let text = (
          <div className='sub-item' key={entry.name} >
            <span className={entry.primary ? 'primary': 'secondary'}>
              {entry.name}
            </span>
            {entry.docs ? (<span> | <a target='_blank' rel='noopener noreferrer' href={entry.docs}> Docs</a></span>) : null}
            {entry.videos ? (<span> | <a target='_blank' without rel='noopener noreferrer' href={entry.videos}> Videos</a></span>) : null}
          </div>
      );
      generatedTOC.push(text);
    }

    return generatedTOC;
  }

  pruneBranches() {
    //We make a set to hold the new valid pointers, there will be a lot less
    let validSet = new Set();

    //Now we walk over the array in reverse order, removing those that are not primary, and adding to the set those that are
    const size = taGenerate.data.length;
    for(let i=size-1;i>-1;i--) {
      if(taGenerate.data[i].primary){
        validSet.add(taGenerate.data[i].id);
      } else {
        //remove it
        taGenerate.data.splice(i,1);
      }
    }

    //Now we loop over the remaining data cleaning up the childPointers, by only including those that are in the validSet
    for(let node of taGenerate.data) {
      let validChildPointers = [];
      if(node.childPointers === undefined || node.childPointers === null) {
        node.childPointers = [];
      }
      for(let child of node.childPointers) {
        if(validSet.has(child)) {
          validChildPointers.push(child);
        }
        node.childPointers = validChildPointers;
      }
    }

    //Now we process the data back into tree format so the tree can use it
    let newData = Object.assign({}, this.populateAllTreeData(this.getEntryFromGeneratedData("A1")));
    this.setTreeData(newData);
  }

  restoreBranches() {
    taGenerate.data = JSON.parse(JSON.stringify(this.state.taGenerateBackup.data)); //deep clone it
    let newData = Object.assign({}, this.populateAllTreeData(this.getEntryFromGeneratedData("A1")));
    this.setTreeData(newData);
  }

  showBranches() {
    if(this.state.showingBranches) {
      //It is currently true so we now swap and hide them
      let taGenerateBackup = JSON.parse(JSON.stringify(taGenerate)); //deep clone it
      this.setState({showingBranches: !this.state.showingBranches, taGenerateBackup}, this.pruneBranches);
    } else {
      this.setState({showingBranches: !this.state.showingBranches}, this.restoreBranches);
    }
  }

  showAll() {

    let newDepth = this.state.showingAll ? 2 : 50;
    this.state.initialDepth = newDepth;
    this.setState({showingAll: !this.state.showingAll});
    let newData = Object.assign({}, this.state.data); //We need this to be a new object to make the tree re-render
    this.setTreeData(newData);
  }

  buildActionSentence() {
    let text = "Approach: collect data";
    for(let i=1;i<this.state.initialDepth;i++) {
      text = text + " - " + this.state.actionSentence[i];
    }
    return text;
  }

  getEntryFromGeneratedData(entryId) {
    for(let entry of taGenerate.data) {
      if(entryId === entry.id) {
        return entry;
      }
    }
    return null;
  }

  getEntryFromGeneratedDataByName(name) {
    for(let entry of taGenerate.data) {
      if(name === entry.name) {
        return entry;
      }
    }
  }

  hasChildPointers(node) {
    if(node && node.childPointers && node.childPointers.length > 0) {
      return true;
    }
    return false;
  }

  //Here we set a new primary flag in the data
  changePrimaryInGroupAndReload(name) {
    let node = this.getEntryFromGeneratedDataByName(name);
    let groupId = node.groupId;
    let groupNodes = [];
    for(let entry of taGenerate.data) {
      if(entry.groupId === groupId) {
        if(entry.id === node.id) {
          entry.primary = true;
        } else {
          entry.primary = false;
        }
      }
    }
    //let newData = this.generateTreeData();
    let newData = Object.assign({}, this.populateAllTreeData(this.getEntryFromGeneratedData("A1")));
    //let newData = this.populateAllTreeData(this.getEntryFromGeneratedData("A1"));
    this.setTreeData(newData);
    //this.populateAllTreeData(this.getEntryFromGeneratedData("A1"));
  }

  //We need a method that gets past an id, we pull that node, check if it has children, populate them if it does, then recursivly pass again
  populateAllTreeData(node) {
    if(this.hasChildPointers(node) && node.primary) {
      let children = [];
      for(let childPointer of node.childPointers) {
        let child = this.getEntryFromGeneratedData(childPointer);
        if(!child.primary) {
          delete child.children;
        }
        children.push(child);
      }
      node.children = children;
      //Now walk the children array and repeat
      for(let childNode of children) {
        if(childNode.primary) {
          this.populateAllTreeData(childNode);
        }
      }
    }
    return node;
  }

  //Pass the id for the node that is clicked on and the tree will be built based on the current tree
  generateTreeData() {
    let flatData = taGenerate.data;
    //We always start with the root item
    let rootNode = this.getEntryFromGeneratedData("A1");
    let currentNode = rootNode;
    let nextNode = null;
    let depth = 50; //We set this value to know how far down the chain to go
    let currentDepth = 0;

    while(currentDepth < depth) {
      currentDepth++;
      if(this.hasChildPointers(currentNode)) {
        let children = [];
        for(let childPointer of currentNode.childPointers) {
          let child = this.getEntryFromGeneratedData(childPointer);
          children.push(child);
          if(this.hasChildPointers(child) && child.primary) {
            nextNode = child;
          }
        }
        currentNode.children = children;
        if(nextNode) {
          currentNode = nextNode;
          nextNode = null;
        } else {
          currentNode = null;
        }
      }
    }
    return rootNode;
  }
  _getTreeViewActionComponent(isTreeView){
    return(<React.Fragment>
        {/*this.state.showingBranches ? <ViewFilled size={16}  /> : <ViewOffFilled size={16} />*/}

        <span className=''><a href='#' onClick={() => this.showBranches()}>{
          !this.state.showingBranches ? 'Show unselected nodes' : 'Hide unselected nodes'}</a>
          {/*} <Toggle id="toggle-4" labelText="unselected node text" />*/}
        </span> <span className={'divider'}/>
        <span><a href='#' onClick={() => this.showAll()}>{this.state.showingAll ? ' Collapse tree view' : ' Expand tree view'} </a> </span>
      </React.Fragment>
    );
  }


  render() {

    let toc = null;
    if(this.state.tocMode) {
      toc = this.generateToc();
    }
    //if its in tree view mode we should hide text
    let isTreeView = !this.state.tocMode;

    let treeViewActionComponent = this._getTreeViewActionComponent(isTreeView);
    let actionControlCls = isTreeView ? 'tree--action-controls' : 'tree--action-controls-hide';
    return (
      <div className="App">
        <Header onClick={() => this.showModal()} {...this.props} />


        {/*<h1> Mass Modernization Exemplar || <span style={{fontSize:'20px'}}><span style={{color:'green'}}>Green Nodes </span> = in scope for MVP</span></h1> */}
        {/*<h3> {this.state.actionSentence} </h3>*/}
        <nav>
          <div className='view-controls'>
            {/*<a href="#" onClick={() => this.setTreeData(ta)}>main-path</a> |
          <a href='#' onClick={() => this.setTreeData(taVerb)}>verb-path</a> |
          <a href='#' onClick={() => this.setTreeData(this.populateAllTreeData(this.getEntryFromGeneratedData("A1")))}>generate</a> | */}
            <span><a href='#' onClick={() => this.showToc()}>{this.state.tocMode ? ' Show Tree ' : ' Show Table of Contents'}</a> </span>
            <span className={actionControlCls}>{treeViewActionComponent}</span>

          </div>
        </nav>

        <Modal
          isOpen={this.state.showDialog}
          onRequestClose={this.state.closeModal}
          contentLabel="Playbook Modal"
          style={customModalStyles}
        >
            <iframe width="1120" height="630"
                  src="https://www.youtube.com/embed/iyLrL-S0UjM?autoplay=1&si=yv6AYUUofOiDBu9j&amp;controls=0"
                  title="YouTube video player" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>
            <div><button style={{float:'right'}} onClick={this.state.closeModal}>Close</button></div>
        </Modal>

        <div className="demo-container">
          <div className="column-right">
            {this.state.tocMode ?
              (<React.Fragment>
                <div className={'view-container'}>
                  <div className={'toc-Wrapper'}>{toc}</div>
                </div>
              </React.Fragment>)
              :
              <React.Fragment>
                <div ref={tc => (this.treeContainer = tc)} className="tree-container">
                  <Tree
                    hasInteractiveNodes
                    data={this.state.data}
                    renderCustomNodeElement={
                      this.state.renderCustomNodeElement
                        ? rd3tProps => this.state.renderCustomNodeElement(rd3tProps, this.state)
                        : undefined
                    }
                    rootNodeClassName="demo-node"
                    branchNodeClassName="demo-node"
                    orientation={this.state.orientation}
                    dimensions={this.state.dimensions}
                    centeringTransitionDuration={this.state.centeringTransitionDuration}
                    translate={{ x: this.state.translateX, y: this.state.translateY }}
                    pathFunc={this.state.pathFunc}
                    collapsible={this.state.collapsible}
                    initialDepth={this.state.initialDepth}
                    zoomable={this.state.zoomable}
                    draggable={this.state.draggable}
                    zoom={this.state.zoom}
                    scaleExtent={this.state.scaleExtent}
                    nodeSize={this.state.nodeSize}
                    separation={this.state.separation}
                    enableLegacyTransitions={this.state.enableLegacyTransitions}
                    transitionDuration={this.state.transitionDuration}
                    depthFactor={this.state.depthFactor}
                    styles={this.state.styles}
                    shouldCollapseNeighborNodes={this.state.shouldCollapseNeighborNodes}
                    // onUpdate={(...args) => {console.log(args)}}
                    onNodeClick={(node, evt) => {
                      console.log('onNodeClick', node, evt);
                    }}
                    onNodeMouseOver={(...args) => {
                      console.log('onNodeMouseOver', args);
                    }}
                    onNodeMouseOut={(...args) => {
                      console.log('onNodeMouseOut', args);
                    }}
                    onLinkClick={(...args) => {
                      console.log('onLinkClick');
                      console.log(args);
                    }}
                    onLinkMouseOver={(...args) => {
                      console.log('onLinkMouseOver', args);
                    }}
                    onLinkMouseOut={(...args) => {
                      console.log('onLinkMouseOut', args);
                    }}
                  />
                </div></React.Fragment>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
