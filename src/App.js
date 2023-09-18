import React, { Component } from 'react';
import clone from 'clone';
import Tree from 'react-d3-tree';
import { version } from 'react-d3-tree/package.json';
import Switch from './components/Switch';
import MixedNodeElement from './components/MixedNodeElement';
import PureSvgNodeElement from './components/PureSvgNodeElement';
import MixedNodeInputElement from './components/MixedNodeInputElement';
import './App.css';

// Data examples
import orgChartJson from './examples/org-chart.json.bck';
import ta from './examples/ta.json';
import taVerb from './examples/ta-verb.json';
import taTest from './examples/ta-test.json';
import taGenerate from './examples/ta-generate.json';
import flareJson from './examples/d3-hierarchy-flare.json';
import reactTree from './examples/reactRepoTree';

import Modal from 'react-modal';

console.log('Demo React version: ', React.version);

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

    this.state = {
      data: ta,
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
      zoom: 0.6,
      scaleExtent: { min: 0.1, max: 5 },
      separation: { siblings: 1.25, nonSiblings: 1.75 },
      nodeSize: { x: 200, y: 150 },
      enableLegacyTransitions: false,
      transitionDuration: 500,
      renderCustomNodeElement: customNodeFnMapping['input'].fn,
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
    console.info('..... setTreeData .....', data);
    this.setState({
      data/*,
      totalNodeCount: countNodes(0, Array.isArray(data) ? data[0] : data),*/
    });
  }

  setActionSentence(actionSentence) {
    console.info('..... actionSentence .....', actionSentence);
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
    console.info('......addChildNode.....')
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

  showAll() {

    let newDepth = this.state.showingAll ? 1 : 50;
    this.state.initialDepth = newDepth;
    this.setState({showingAll: !this.state.showingAll});
    let newData = Object.assign({}, this.state.data); //We need this to be a new object to make the tree re-render
    this.setTreeData(newData);
  }

  buildActionSentence() {
    console.info('building action sentence......');
    let text = "Approach: collect data";
    for(let i=1;i<this.state.initialDepth;i++) {
      text = text + " - " + this.state.actionSentence[i];
    }
    return text;
  }

  getEntryFromGeneratedData(entryId) {
    for(let entry of taGenerate.data) {
      if(entryId === entry.id) {
        //console.info("Match: ", entry);
        return entry;
      }
    }
  }

  getEntryFromGeneratedDataByName(name) {
    for(let entry of taGenerate.data) {
      if(name === entry.name) {
        //console.info("Match: ", entry);
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
    console.info('changePrimaryInGroupAndReload.... ', node);
    let groupId = node.groupId;
    let groupNodes = [];
    for(let entry of taGenerate.data) {
      if(entry.groupId === groupId) {
        console.info('setting primary false for..... ', groupId, entry);
        if(entry.id === node.id) {
          entry.primary = true;
        } else {
          entry.primary = false;
        }
      }
    }
    console.info('AFTER == taGenerate.data: ', taGenerate.data);
    //let newData = this.generateTreeData();
    let newData = Object.assign({}, this.populateAllTreeData(this.getEntryFromGeneratedData("A1")));
    //let newData = this.populateAllTreeData(this.getEntryFromGeneratedData("A1"));
    console.info('newData=== ',newData);
    this.setTreeData(newData);
    //this.populateAllTreeData(this.getEntryFromGeneratedData("A1"));
  }

  //We need a method that gets past an id, we pull that node, check if it has children, populate them if it does, then recursivly pass again
  populateAllTreeData(node) {
    //console.info("****** Name | Primary", node.name, node.primary)
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
    console.info('NODE:: ', node);
    return node;
  }

  //Pass the id for the node that is clicked on and the tree will be built based on the current tree
  generateTreeData() {
    console.info('generateTreeData......');
    let flatData = taGenerate.data;
    console.info("flatData >>> ", flatData);
    //We always start with the root item
    let rootNode = this.getEntryFromGeneratedData("A1");
    let currentNode = rootNode;
    let nextNode = null;
    let depth = 50; //We set this value to know how far down the chain to go
    let currentDepth = 0;

    while(currentDepth < depth) {
      //console.info("currentNode -- nextNode ", currentNode, nextNode);
      currentDepth++;
      if(this.hasChildPointers(currentNode)) {
        let children = [];
        for(let childPointer of currentNode.childPointers) {
          let child = this.getEntryFromGeneratedData(childPointer);
          children.push(child);
          if(this.hasChildPointers(child) && child.primary) {
            //console.info("Primary child with childPointers: ", child);
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

  render() {
    //let generatedData = this.generateTreeData();
    //console.info('generatedData == ', generatedData);
    //let rootNode = this.getEntryFromGeneratedData("A1");
    //let tree = this.populateAllTreeData(rootNode);
    //console.info('TREE:: ', tree);

    return (
      <div className="App">
        <h1 style={{textAlign: 'center'}}><img width="36" alt="Java Application Modernization Playbook icon" height="36" src={'./favicon.png'}></img> Java Application Modernization Playbook <span style={{fontSize:'20px'}}> with Transformation Advsior</span></h1>
        {/*<h1> Mass Modernization Exemplar || <span style={{fontSize:'20px'}}><span style={{color:'green'}}>Green Nodes </span> = in scope for MVP</span></h1> */}
        {/*<h3> {this.state.actionSentence} </h3>*/}
        <hr/>
        <h5 style={{textAlign: 'center'}}>
          {/*<a href="#" onClick={() => this.setTreeData(ta)}>main-path</a> |
          <a href='#' onClick={() => this.setTreeData(taVerb)}>verb-path</a> |
          <a href='#' onClick={() => this.setTreeData(this.populateAllTreeData(this.getEntryFromGeneratedData("A1")))}>generate</a> | */}
          <span><a href='#' onClick={() => this.showModal()}> About</a> </span> |
          <span><a href='#' onClick={() => this.showAll()}>{this.state.showingAll ? ' Hide full selected path ' : ' Show full selected path '}</a> </span> |
          <span><a target='_blank' href='https://github.com/IBM/app-mod-journey/tree/main'> Contribute</a> </span>
        </h5>
        <Modal
            isOpen={this.state.showDialog}
            onRequestClose={this.state.closeModal}
            contentLabel="Exemplar Modal"
        >
          <span><span ref={'refId'} style={{fontSize: '20px'}}>Click on the nodes to explore the tree and find your path to modernization!</span> <button style={{float:'right'}} onClick={this.state.closeModal}>Close</button></span>
          <div style={{textAlign:'center'}}><img height='75%' width='75%' src={'./modExemplar.gif'}/></div>

        </Modal>

        <div className="demo-container">
          <div className="column-right">
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
