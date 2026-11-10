import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header/Header';

describe('Header component', () => {
  it('renders the header title and external links', () => {
    render(<Header aboutClick={vi.fn()} headerClick={vi.fn()} />);

    expect(screen.getByText('Java Application Modernization Playbook')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute(
      'href',
      'https://ibm.github.io/app-mod-journey/details/faq'
    );
    expect(screen.getByRole('link', { name: 'Testimonials' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Install' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contribute' })).toBeInTheDocument();
  });

  it('triggers aboutClick when About is clicked', () => {
    const handleAbout = vi.fn();
    render(<Header aboutClick={handleAbout} headerClick={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'About' }));
    expect(handleAbout).toHaveBeenCalledTimes(1);
  });

  it('triggers headerClick when the title logo is clicked', () => {
    const handleHome = vi.fn();
    render(<Header aboutClick={vi.fn()} headerClick={handleHome} />);

    fireEvent.click(screen.getByText('Java Application Modernization Playbook'));
    expect(handleHome).toHaveBeenCalledTimes(1);
  });
});
