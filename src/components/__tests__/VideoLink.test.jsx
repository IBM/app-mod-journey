import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoLink from '../VideoLink';

describe('VideoLink component', () => {
  it('renders anchor tag with href', () => {
    const testUrl = 'https://www.youtube.com/embed/test';
    render(<VideoLink url={testUrl} onPlay={vi.fn()}>Watch Video</VideoLink>);

    const link = screen.getByRole('link', { name: 'Watch Video' });
    expect(link).toHaveAttribute('href', testUrl);
  });

  it('prevents default link navigation and calls onPlay with url on click', () => {
    const testUrl = 'https://www.youtube.com/embed/test';
    const handlePlay = vi.fn();
    render(<VideoLink url={testUrl} onPlay={handlePlay}>Watch Video</VideoLink>);

    fireEvent.click(screen.getByRole('link', { name: 'Watch Video' }));
    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(testUrl);
  });
});
