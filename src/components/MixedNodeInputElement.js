import React from 'react';
import { Component } from 'react';
import taTest from '../examples/ta-test.json';

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
            while(matchedNode == null && failSafe < 50) {
                failSafe++;
                matchedNode = this.findNodeInTree(currentNodeWithChildren, name);
                currentNodeWithChildren = this.findNodeWithChildrenInTree(currentNodeWithChildren);
                if(matchedNode != null) {
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
        console.info('+++ treeNode, name +++ ', treeNode, name);
        if(treeNode != null) {
            let treeBranch = treeNode.children
            //check the name
            for(let i=0;i<treeBranch.length;i++) {
                console.info('treeBranch[i].name,name', treeBranch[i].name,name);
                if(treeBranch[i].name == name) {
                    console.info('returning the match!!!!!!');
                    let matchedNode = treeBranch[i];
                    return {matchedNode, depth}
                }
            }
            //check for children in the branch
            for(let i=0;i<treeBranch.length;i++) {
                if(treeBranch[i].children && treeBranch[i].children.length > 0) {
                    console.info('looping again.....!!!!!!!');
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
      while(matchedNode == null && initialDepth < 50) {
          initialDepth++;
          matchedNode = this.findNodeInTree(currentNodeWithChildren, name);
          currentNodeWithChildren = this.findNodeWithChildrenInTree(currentNodeWithChildren);
      }
      //console.info('matchedNode ===> ', matchedNode);
      //console.info('currentNodeWithChildren ===> ', currentNodeWithChildren);

      //Now swap the children, merge and return the data
      //let cloneChildren = Object.assign({}, currentNodeWithChildren.children);
      if(currentNodeWithChildren != null) {
          console.info('state depth , new depth ', appState.initialDepth, initialDepth);
          console.info('matchedNode.lockChildren, currentNodeWithChildren.lockChildren: ', matchedNode.lockChildren, currentNodeWithChildren.lockChildren);
              if(!matchedNode.lockChildren) {
                  matchedNode.children = currentNodeWithChildren.children;
              }
              if(matchedNode.name !== currentNodeWithChildren.name) {
                  if(!currentNodeWithChildren.lockChildren) {
                      delete currentNodeWithChildren.children;
                  }
                  appState.initialDepth = initialDepth;
              } /*else {
                  //Here we have clicked on a node with children, we need to decide if we expand or shrink
                  if(initialDepth > appState.initialDepth) {
                      //appState.initialDepth = initialDepth;
                  } else {
                     // appState.initialDepth = initialDepth-1;
                  }
          }*/
          let newData = Object.assign({}, data);
          //appState.actionSentence[initialDepth-1] = matchedNode.name;
          appState.updateActionSentence(this.getActionSentence(appState.data, matchedNode.name));
          appState.updateTree(newData);
      }
  }

  swapChildrenInTree2(appState, data, name, triggerNodeToggle) {
        console.info(' .... swapChildrenInTree2 .....');
        let currentNodeWithChildren = data;
        let matchedNode = null;
        let depth = 50;
        let initialDepth = 1; //If we ask for a node that is not there, make sure we can break the loop
        while(matchedNode == null && initialDepth < 50) {
            initialDepth++;
            let matchingObject = this.findNodeInTree(currentNodeWithChildren, name, initialDepth);
            matchedNode = matchingObject.matchedNode;
            depth = matchingObject.depth;
            console.info('matchedNode, currentNodeWithChildren, name', matchedNode, currentNodeWithChildren, name);
        }
      //if(matchedNode && matchedNode.children && matchedNode.children.length) {
          //appState.updateActionSentence(this.getActionSentence(appState.data, matchedNode.name));
          appState.initialDepth = depth;
          appState.changePrimary(name);
      //}
      //Do nothing
    }

  //We walk the tree and find the JS object with the matching name
  getObjectInTreeByNodename(nodeWithChildren, name) {
      console.info('getObjectInTreeByNodename..... ', nodeWithChildren, name);
      let nextNodeWithChildren = null;

      if(nodeWithChildren != null && nodeWithChildren.children && nodeWithChildren.children.length > 0) {
          console.info('Checking the node for a match....nodeWithChildren ====', nodeWithChildren.name);
          let dataArray = nodeWithChildren.children;
          for(let x=0;x<dataArray.length;x++) {
              if(dataArray[x].children && dataArray[x].children.length > 0) {
                  console.info('**** this node has children ******', dataArray[x]);
                  nextNodeWithChildren = dataArray[x];
              }
          }
          for(let i=0;i<dataArray.length;i++) {
              //console.info('Dataarray entry ++++++++ ', dataArray[i]);
              if(dataArray[i].name === name) {
                  let nodeToAddChildren =  dataArray[i];
                  return {nodeToAddChildren, nextNodeWithChildren}
              }
          }
          console.info('Repeat call ...... ', nextNodeWithChildren, name);
          return this.getObjectInTreeByNodename(nextNodeWithChildren, name);
      }
  }

  //When we enter the node we give a short delay then we pop up a description
  nodeMouseEnter() {
        console.info(' ==== nodeMouseEnter =====');
      let {nodeData = {}} = this.props;
      if(nodeData) {
          //If we already are running a timer for the description for this node then do nothing
          console.info(nodeData.name, descriptionTimerInfo.nodeName);
          if(nodeData.name == descriptionTimerInfo.nodeName) {
              return;
          }
          let timerId = setTimeout(() =>{
              console.info(nodeData);
              this.setState({showDescription: true});
              //Now this is where I pop up the dialog or something
          }, 800);
          descriptionTimerInfo = {timerId: timerId, nodeName: nodeData.name}
      }
  }

  nodeMouseLeave() {
        console.info(' .... nodeMouseLeave .....', descriptionTimerInfo, this.state.showDescription);if(descriptionTimerInfo != null && descriptionTimerInfo.timerId != null) {
          clearTimeout(descriptionTimerInfo.timerId);
          descriptionTimerInfo = {timerId: null, nodeName: ''}
          if(this.state.showDescription) {
              this.setState({showDescription: false});
          }
      }
  }

  nodeClick() {
      let {appState, nodeData = {}, triggerNodeToggle, foreignObjectProps = {}} = this.props;
      //console.info('.... nodeClick ......');
      //console.info('.... appState ......', appState);
      console.info('.... appData ......', appState.data);
      //console.info('.... nodeData ......', nodeData);
      //At this point we find the siblings of this node, then find the one with children and move those children to this node
      //Going to hard code for now
      if(nodeData.children && nodeData.children.length >0) {
          //This already has children, don't need to do anything
          //console.info('Children already');
          //let depth = this.getNodeDepth(appState.data, nodeData.name);
          //console.info('depth >>>> ', depth);
          //appState.actionSentence[depth] = nodeData.name;
          appState.updateActionSentence(this.getActionSentence(appState.data, nodeData.name));
          triggerNodeToggle();
          //this.swapChildrenInTree(appState, appState.data, nodeData.name, triggerNodeToggle);
      } else {

          console.info('$$$$$$$$$ No children on this node, switch it', nodeData.name);
          //appState.changePrimary(nodeData.name);


          //let matchedNode = this.findNodeInTree(appState.data, 'view results with filtering');
          //console.info('matchedNode >>>> ', matchedNode);


          this.swapChildrenInTree2(appState, appState.data, nodeData.name, triggerNodeToggle);


          /*let {nodeToAddChildren, nextNodeWithChildren} = this.getObjectInTreeByNodename(appState.data, nodeData.name);
          console.info('&&&&&& currentNode ===> ', nodeToAddChildren, nextNodeWithChildren);
          let data = appState.data;
          let kids = nextNodeWithChildren.children;
          for(let i=0;i<kids.length;i++) {
              if(kids[i].children) {
                  //console.info('Found the one with children...', kids[i]);
                  //nodeData.children = firstKids[i].children;
                  let cloneChildren = Object.assign({}, kids[i]).children;
                  //console.info('cloneChildren.... ', cloneChildren);
                  //data.children[0].children = firstKids[i].children;
                  nodeToAddChildren.children = kids[i].children;
                  //delete firstKids[i].children;
                  delete nextNodeWithChildren.children;
                  //let holder = Object.assign({}, firstKids[i]);
                  //console.info('data now====> ', data);
                  //firstKids[i] = data.children[0];
                  //data.children[0] = holder;

                  let newData = Object.assign({}, data);

                  appState.updateTree(newData, triggerNodeToggle);
                  //continue;
              }
          } */
      }

      //setTimeout(triggerNodeToggle, 500);
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
      let {nodeData = {}, triggerNodeToggle, foreignObjectProps = {}} = this.props;
      let nodeNameFontSize = '25px'
      if(nodeData.name.length > 35) {
          nodeNameFontSize = '22px'
      }else {
          nodeNameFontSize = '25px'
      }

        return (
            <React.Fragment>
                <circle r={20} onClick={this.nodeClick} onMouseEnter={this.nodeMouseEnter} onMouseLeave={this.nodeMouseLeave}></circle>
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
                            paddingBottom: '1rem',
                            //backgroundColor: 'rgb(248, 248, 255)', // ghostwhite
                            //backgroundColor: 'white',
                        }}
                    >

                        <div style={{backgroundColor: 'white'}}>
                            {/*this.getFontColor(nodeData.color)*/}
                            <span onClick={this.nodeClick} onMouseEnter={this.nodeMouseEnter} onMouseLeave={this.nodeMouseLeave} style={{backgroundColor: 'white', color: nodeData.primary ? 'black' : 'grey' , fontWeight: nodeData.primary ? '700':'400', fontSize: nodeNameFontSize}}>{nodeData.name}</span>
                            { nodeData.root? (<div/>) :
                                <div style={{backgroundColor: 'white'}}>
                                    <span style={{fontSize: 22}}>{nodeData.docs ? (<a target='_blank' href={nodeData.docs}>Docs</a>) : ''}</span>
                                    <span style={{fontSize: 22}}> {(nodeData.docs && nodeData.videos) ? ('|') : ''} </span>
                                    <span style={{fontSize: 22}} >{nodeData.videos ? (<a target='_blank' href={nodeData.videos}>Videos</a>) : ''}</span>
                                </div>}
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
                                <p>{nodeData.name}</p>
                                <p>{nodeData.description ? nodeData.description : ''}</p>
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
