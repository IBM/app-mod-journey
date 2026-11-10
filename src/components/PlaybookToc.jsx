import React from 'react';
import { TableOfContents } from '@carbon/icons-react';
import VideoLink from './VideoLink';

function sectionName(sections, groupId) {
  const section = sections.find(candidate => candidate.groupId === groupId);
  return section ? section.name : null;
}

/** Every playbook entry in a list, grouped under the heading for its section. */
export default function PlaybookToc({ entries, sections, onPlayVideo }) {
  const seenGroups = new Set();
  const items = [];

  for (const entry of entries) {
    // The first entry of a group gets the heading for the group
    if (!seenGroups.has(entry.groupId)) {
      seenGroups.add(entry.groupId);
      items.push(
        <div key={`group-${entry.groupId}`} className={'h2-heading'}>{sectionName(sections, entry.groupId)}</div>
      );
    }

    items.push(
      <div data-cy='toc-item' className='sub-item' key={entry.name}>
        <span className={entry.primary ? 'primary' : 'secondary'}>
          {entry.name}
        </span>
        {entry.docs ? (<span> | <a target='_blank' rel='noopener noreferrer' href={entry.docs}> Docs</a></span>) : null}
        {entry.videos ? (
          <span> | <VideoLink data-cy='toc-video-link' url={entry.videos} onPlay={onPlayVideo}> Videos</VideoLink></span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={'view-container'}>
      <div className={'toc-Wrapper'}>
        <div className={'h1-heading'}>
          <TableOfContents size={'20px'} />
          <span data-cy='toc-title' style={{marginLeft: '5px'}}>Table of Contents</span>
        </div>
        {items}
      </div>
    </div>
  );
}
