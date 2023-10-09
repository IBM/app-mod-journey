import React from 'react';
import { Component } from 'react';

let descriptionTimerInfo = {timerId: null, nodeName: ''};

class MixedNodeElement extends Component {

    constructor() {
        super();
        this.nodeClick = this.nodeClick.bind(this);
        this.nodeMouseEnter = this.nodeMouseEnter.bind(this);
        this.nodeMouseLeave = this.nodeMouseLeave.bind(this);
        this.getObjectInTreeByNodename = this.getObjectInTreeByNodename.bind(this);
        this.swapChildrenInTree = this.swapChildrenInTree.bind(this);

        this.state = {showDescription: false}
    }

    getActionSentence(treeData, name) {
        let currentNodeWithChildren = treeData;
        let matchedNode = null;
        let failSafe = 0;
        let actionSentence = "collect data"
        try {
            while(matchedNode === null && failSafe < 50) {
                failSafe++;
                matchedNode = this.findNodeInTree(currentNodeWithChildren, name);
                currentNodeWithChildren = this.findNodeWithChildrenInTree(currentNodeWithChildren);
                if(matchedNode !== null) {
                    actionSentence = actionSentence + " - " + matchedNode.name;
                } else {
                    actionSentence = actionSentence + " - " + currentNodeWithChildren.name;
                }
            }
        } catch(e) {
            console.info('Some issue with constructing the sentence.....');
        }

        return actionSentence;
    }

    findNodeWithChildrenInTree(treeNode)  {
        if(treeNode != null) {
            let treeBranch = treeNode.children;
            for(let i=0;i<treeBranch.length;i++) {
                if(treeBranch[i].children) {
                    return treeBranch[i];
                }
            }
        }
        return null;
    }

  //Search for node in this tree branch, returning null if it is not found
  findNodeInTree(treeNode, name, depth)  {
        if(treeNode != null) {
            let treeBranch = treeNode.children
            //check the name
            for(let i=0;i<treeBranch.length;i++) {
                if(treeBranch[i].name === name) {
                    let matchedNode = treeBranch[i];
                    return {matchedNode, depth}
                }
            }
            //check for children in the branch
            for(let i=0;i<treeBranch.length;i++) {
                if(treeBranch[i].children && treeBranch[i].children.length > 0) {
                    depth++;
                    return this.findNodeInTree(treeBranch[i], name, depth);
                }
            }
        }
        return null;
  }

  //This takes the whole tree data and a name
  //It finds the node with that name, and the children at the same level as that node and swaps them, rturning the new data
  swapChildrenInTree(appState, data, name, triggerNodeToggle) {
      let currentNodeWithChildren = data;
      let matchedNode = null;
      let initialDepth = 1; //If we ask for a node that is not there, make sure we can break the loop
      while(matchedNode === null && initialDepth < 50) {
          initialDepth++;
          matchedNode = this.findNodeInTree(currentNodeWithChildren, name);
          currentNodeWithChildren = this.findNodeWithChildrenInTree(currentNodeWithChildren);
      }

      //Now swap the children, merge and return the data
      if(currentNodeWithChildren != null) {
              if(!matchedNode.lockChildren) {
                  matchedNode.children = currentNodeWithChildren.children;
              }
              if(matchedNode.name !== currentNodeWithChildren.name) {
                  if(!currentNodeWithChildren.lockChildren) {
                      delete currentNodeWithChildren.children;
                  }
                  appState.initialDepth = initialDepth;
              }
          let newData = Object.assign({}, data);
          appState.updateActionSentence(this.getActionSentence(appState.data, matchedNode.name));
          appState.updateTree(newData);
      }
  }

  swapChildrenInTree2(appState, data, name, triggerNodeToggle) {
        let currentNodeWithChildren = data;
        let matchedNode = null;
        let depth = 50;
        let initialDepth = 1; //If we ask for a node that is not there, make sure we can break the loop
        while(matchedNode === null && initialDepth < 50) {
            initialDepth++;
            let matchingObject = this.findNodeInTree(currentNodeWithChildren, name, initialDepth);
            matchedNode = matchingObject.matchedNode;
            depth = matchingObject.depth;
        }
          appState.initialDepth = depth;
          appState.changePrimary(name);
    }

  //We walk the tree and find the JS object with the matching name
  getObjectInTreeByNodename(nodeWithChildren, name) {
      let nextNodeWithChildren = null;

      if(nodeWithChildren != null && nodeWithChildren.children && nodeWithChildren.children.length > 0) {
          let dataArray = nodeWithChildren.children;
          for(let x=0;x<dataArray.length;x++) {
              if(dataArray[x].children && dataArray[x].children.length > 0) {
                  nextNodeWithChildren = dataArray[x];
              }
          }
          for(let i=0;i<dataArray.length;i++) {
              if(dataArray[i].name === name) {
                  let nodeToAddChildren =  dataArray[i];
                  return {nodeToAddChildren, nextNodeWithChildren}
              }
          }
          return this.getObjectInTreeByNodename(nextNodeWithChildren, name);
      }
  }

  //When we enter the node we give a short delay then we pop up a description
  nodeMouseEnter() {
      let {nodeData = {}} = this.props;
      if(nodeData) {
          //If we already are running a timer for the description for this node then do nothing
          if(nodeData.name === descriptionTimerInfo.nodeName) {
              return;
          }
          let timerId = setTimeout(() =>{
              //NOTE: I HAVE TURNED OFF DESCRIOTIONS FOR NOW, SO THIS IS BEING HARDCODE TO FALSE
              //TODO: TURN BACK ON AND MAKE THEM LOOK NICE!!
              this.setState({showDescription: false});
              //Now this is where I pop up the dialog or something
          }, 800);
          descriptionTimerInfo = {timerId: timerId, nodeName: nodeData.name}
      }
  }

  nodeMouseLeave() {
        if(descriptionTimerInfo != null && descriptionTimerInfo.timerId != null) {
          clearTimeout(descriptionTimerInfo.timerId);
          descriptionTimerInfo = {timerId: null, nodeName: ''}
          if(this.state.showDescription) {
              this.setState({showDescription: false});
          }
      }
  }

  nodeClick() {
      let {appState, nodeData = {}, triggerNodeToggle, foreignObjectProps = {}} = this.props;
      //At this point we find the siblings of this node, then find the one with children and move those children to this node
      //Going to hard code for now
      if(nodeData.children && nodeData.children.length >0) {
          appState.updateActionSentence(this.getActionSentence(appState.data, nodeData.name));
          triggerNodeToggle();
      } else {
          this.swapChildrenInTree2(appState, appState.data, nodeData.name, triggerNodeToggle);
      }
  }

  getFontColor(color) {
        //Override for now
        return 'black';
        if(color != 'undefined') {
            return color;
        }
        return 'black';
  }

  render() {
      let {appState, nodeData = {}, triggerNodeToggle, foreignObjectProps = {}} = this.props;
      let nodeNameFontSize = '25px'
      if(nodeData.name.length > 35) {
          nodeNameFontSize = '22px'
      }else {
          nodeNameFontSize = '25px'
      }

        return (
            <React.Fragment>
                <circle fill={'white'} r={20} onClick={this.nodeClick} onMouseEnter={this.nodeMouseEnter} onMouseLeave={this.nodeMouseLeave}></circle>

                    <foreignObject {...foreignObjectProps} >
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                //justifyContent: 'space-between',
                                border: '1px solid white',
                                paddingBottom: '1rem'
                            }}
                        >
                            <div className='node-textContainer' style={{backgroundColor: 'white'}}>
                                <span onClick={this.nodeClick} onMouseEnter={this.nodeMouseEnter}
                                      onMouseLeave={this.nodeMouseLeave} style={{
                                    backgroundColor: 'white',
                                    color: nodeData.primary ? 'black' : 'lightgrey',
                                    fontWeight: nodeData.primary ? '700' : '400',
                                    fontSize: nodeNameFontSize
                                }}>{nodeData.name}</span>
                                    <div style={{backgroundColor: 'white'}}>
                                        <span style={{fontSize: 22}}>{nodeData.docs ? (
                                            <a target='_blank' href={nodeData.docs}>Docs</a>) : ''}</span>
                                        <span
                                            style={{fontSize: 22}}> {(nodeData.docs && nodeData.videos) ? ('|') : ''} </span>
                                        <span style={{fontSize: 22}}>{nodeData.videos ? (
                                            <a target='_blank' href={nodeData.videos}>Videos</a>) : ''}</span>
                                    </div>
                            </div>
                        </div>
                    </foreignObject>


                {/* WATCH OUT!! If you pop the tooltip so that is covers the mouse it will trigger the mouseLeave and you get a flickering loop*/}
                {this.state.showDescription ?
                    <foreignObject width={300} height={200} x={-150} y={-225}>
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                //justifyContent: 'space-between',
                                border: '1px solid black',
                                paddingBottom: '1rem',
                                backgroundColor: 'rgb(248, 248, 255)', // ghostwhite
                                //backgroundColor: 'white',
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
//};

}

export default MixedNodeElement;
