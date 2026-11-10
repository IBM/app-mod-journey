import React, { useEffect, useRef, useState } from 'react';
import VideoLink from './VideoLink';

/**
 * Interactive tree node. Clicking or activating via Enter/Space makes it the primary node.
 * Supports configurable hover descriptions with isolated instance timers.
 *
 * @param {Object} props
 * @param {Object} props.appState App state, used to read the tree and update the primary node
 * @param {Object} props.nodeData react-d3-tree node datum
 * @param {Object} props.foreignObjectProps size and position of the label
 * @param {boolean} [props.enableDescriptions=false] Whether hover description tooltips are enabled
 */
function MixedNodeElement({
  appState,
  nodeData = {},
  foreignObjectProps = {},
  enableDescriptions = false,
}) {
  const [showDescription, setShowDescription] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (!enableDescriptions || !nodeData) return;
    timerRef.current = setTimeout(() => {
      setShowDescription(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (showDescription) {
      setShowDescription(false);
    }
  };

  const handleSelect = () => {
    if (appState && typeof appState.changePrimary === 'function' && nodeData.name) {
      appState.changePrimary(nodeData.name);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const nodeNameFontSize = (nodeData.name && nodeData.name.length > 35) ? '22px' : '25px';

  return (
    <React.Fragment>
      <circle
        fill="white"
        r={20}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-pressed={Boolean(nodeData.primary)}
        aria-label={`Select ${nodeData.name || 'node'}`}
        style={{ cursor: 'pointer' }}
      />

      <foreignObject {...foreignObjectProps}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '1px solid white',
            paddingBottom: '1rem',
          }}
        >
          <div className="node-textContainer" style={{ backgroundColor: 'white' }}>
            <span
              onClick={handleSelect}
              onKeyDown={handleKeyDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="button"
              tabIndex={0}
              aria-pressed={Boolean(nodeData.primary)}
              style={{
                backgroundColor: 'white',
                color: nodeData.primary ? 'black' : 'grey',
                fontWeight: nodeData.primary ? '700' : '400',
                fontSize: nodeNameFontSize,
                cursor: 'pointer',
                outlineOffset: '2px',
              }}
            >
              {nodeData.name}
            </span>
            <div style={{ backgroundColor: 'white' }}>
              <span style={{ fontSize: 22, fontWeight: 500 }}>
                {nodeData.docs ? (
                  <a target="_blank" rel="noopener noreferrer" href={nodeData.docs}>
                    Docs
                  </a>
                ) : null}
              </span>
              <span style={{ fontSize: 22, fontWeight: 500 }}>
                {nodeData.docs && nodeData.videos ? ' | ' : ''}
              </span>
              <span style={{ fontSize: 22, fontWeight: 500 }}>
                {nodeData.videos ? (
                  <VideoLink url={nodeData.videos} onPlay={appState.playVideo}>
                    Videos
                  </VideoLink>
                ) : null}
              </span>
            </div>
          </div>
        </div>
      </foreignObject>

      {showDescription ? (
        <foreignObject width={300} height={200} x={-150} y={-225}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid black',
              padding: '0.75rem',
              backgroundColor: 'rgb(248, 248, 255)', // ghostwhite
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              overflowY: 'auto',
            }}
          >
            <span style={{ color: 'black', fontWeight: '400', fontSize: '18px' }}>
              <p style={{ margin: 0 }}>{nodeData.description || nodeData.name}</p>
            </span>
          </div>
        </foreignObject>
      ) : null}
    </React.Fragment>
  );
}

export default MixedNodeElement;
