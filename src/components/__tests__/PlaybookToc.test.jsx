import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlaybookToc from '../PlaybookToc';

const mockSections = [
  { groupId: 'A', name: 'Data Collection' },
  { groupId: 'B', name: 'Analysis Stage' },
];

const mockEntries = [
  {
    id: 'A1',
    groupId: 'A',
    name: 'collect data',
    primary: true,
    docs: 'https://example.com/docs/a1',
    videos: 'https://www.youtube.com/embed/a1',
  },
  {
    id: 'B1',
    groupId: 'B',
    name: 'from Application Binaries',
    primary: false,
    docs: 'https://example.com/docs/b1',
  },
  {
    id: 'B2',
    groupId: 'B',
    name: 'from Liberty',
    primary: false,
  },
];

describe('PlaybookToc component', () => {
  it('renders section headings and grouped entries', () => {
    render(<PlaybookToc entries={mockEntries} sections={mockSections} onPlayVideo={vi.fn()} />);

    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
    expect(screen.getByText('Analysis Stage')).toBeInTheDocument();

    expect(screen.getByText('collect data')).toBeInTheDocument();
    expect(screen.getByText('from Application Binaries')).toBeInTheDocument();
    expect(screen.getByText('from Liberty')).toBeInTheDocument();
  });

  it('renders doc links with target _blank and rel noopener noreferrer', () => {
    render(<PlaybookToc entries={mockEntries} sections={mockSections} onPlayVideo={vi.fn()} />);

    const docLinks = screen.getAllByRole('link', { name: /docs/i });
    expect(docLinks).toHaveLength(2);
    expect(docLinks[0]).toHaveAttribute('href', 'https://example.com/docs/a1');
    expect(docLinks[0]).toHaveAttribute('target', '_blank');
    expect(docLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('triggers onPlayVideo when video link is clicked', () => {
    const handlePlayVideo = vi.fn();
    render(<PlaybookToc entries={mockEntries} sections={mockSections} onPlayVideo={handlePlayVideo} />);

    const videoLink = screen.getByRole('link', { name: /videos/i });
    fireEvent.click(videoLink);

    expect(handlePlayVideo).toHaveBeenCalledWith('https://www.youtube.com/embed/a1');
  });
});
