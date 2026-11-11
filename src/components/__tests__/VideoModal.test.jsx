import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from 'react-modal';
import VideoModal from '../VideoModal';

describe('VideoModal component', () => {
  let appRoot;

  beforeEach(() => {
    appRoot = document.body.appendChild(document.createElement('div'));
    Modal.setAppElement(appRoot);
  });

  afterEach(() => {
    appRoot.remove();
  });

  it('renders nothing when url is null or empty', () => {
    render(<VideoModal url={null} onClose={vi.fn()} />, { container: appRoot });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders YouTube iframe with strict referrer policy when url is provided', () => {
    const testUrl = 'https://www.youtube.com/embed/iyLrL-S0UjM?autoplay=1';
    render(<VideoModal url={testUrl} onClose={vi.fn()} />, { container: appRoot });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('src', testUrl);
    expect(iframe).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  });

  it('calls onClose when the Close button is clicked', () => {
    const handleClose = vi.fn();
    render(<VideoModal url="https://www.youtube.com/embed/test" onClose={handleClose} />, {
      container: appRoot,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
