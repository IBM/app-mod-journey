import React from 'react';
import Header from './components/Header/Header';
import PlaybookToc from './components/PlaybookToc';
import PlaybookTree from './components/PlaybookTree';
import VideoModal from './components/VideoModal';
import usePlaybook from './hooks/usePlaybook';
import useVideoModal from './hooks/useVideoModal';
import taGenerate from './examples/ta-generate.json';
import './App.css';

const ABOUT_VIDEO = 'https://www.youtube.com/embed/iyLrL-S0UjM?autoplay=1&si=yv6AYUUofOiDBu9j&controls=0';

// Clean up the URL and return to the starting point
function goHome() {
  window.location.href = window.location.origin + window.location.pathname;
}

function App() {
  const { state, treeContainer, selectNode, toggleShowAll, toggleToc, toggleBranches } = usePlaybook();
  const { videoUrl, playVideo, closeVideo } = useVideoModal();
  const { tocMode, showingBranches, showingAll, tree, initialDepth, translate, entries } = state;

  // The tree controls only make sense in tree view
  const actionControlCls = tocMode ? 'tree--action-controls-hide' : 'tree--action-controls';

  return (
    <div className="App">
      <Header aboutClick={() => playVideo(ABOUT_VIDEO)} headerClick={goHome} />

      <nav>
        <div className='view-controls'>
          <span><button data-cy='show-toc-view' className={'link-style'} onClick={toggleToc}>{tocMode ? ' Show Tree ' : ' Show Table of Contents'}</button> </span>
          <span className={actionControlCls}>
            <span className=''><button data-cy='toggle-branches' className={'link-style'} onClick={toggleBranches}>{
              !showingBranches ? 'Show unselected nodes' : 'Hide unselected nodes'}</button>
            </span> <span className={'divider'}/>
            <span><button data-cy='toggle-expand' className={'link-style'} onClick={toggleShowAll}>{showingAll ? ' Collapse tree view' : ' Expand tree view'} </button> </span>
          </span>
        </div>
      </nav>

      <VideoModal url={videoUrl} onClose={closeVideo} />

      <div className="demo-container">
        <div className="column-right">
          {tocMode ?
            <PlaybookToc entries={entries} sections={taGenerate.tocSections} onPlayVideo={playVideo} />
            :
            <PlaybookTree
              containerRef={treeContainer}
              tree={tree}
              translate={translate}
              initialDepth={initialDepth}
              onSelectNode={selectNode}
              onPlayVideo={playVideo}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
