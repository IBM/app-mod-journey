import React from 'react';

/**
 * A link to a video that plays in the page instead of opening a new tab.
 * Keeps a real href, so copy-link and middle-click still work.
 */
export default function VideoLink({ url, onPlay, children, ...props }) {
  const handleClick = (event) => {
    event.preventDefault();
    onPlay(url);
  };

  return <a href={url} onClick={handleClick} {...props}>{children}</a>;
}
