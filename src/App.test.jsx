import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import Modal from 'react-modal';
import App from './App';

// jsdom cannot lay out SVG, which react-d3-tree needs. Render just the root node through the app's own node renderer.
vi.mock('react-d3-tree', () => ({
  default: function MockTree({ data, renderCustomNodeElement }) {
    return <svg data-testid='tree'>{renderCustomNodeElement({ nodeDatum: data, toggleNode: () => {} })}</svg>;
  },
}));

// react-modal hides the app element from screen readers while a modal is open, so the app must not be the body itself
let appRoot;
beforeEach(() => {
  window.history.replaceState({}, '', '/');
  appRoot = document.body.appendChild(document.createElement('div'));
  Modal.setAppElement(appRoot);
});
afterEach(() => appRoot.remove());

const renderApp = () => render(<App />, { container: appRoot });

test('shows the title and the first step of the tree', () => {
  renderApp();
  expect(screen.getByText('Java Application Modernization Playbook')).toBeInTheDocument();
  expect(screen.getByTestId('tree')).toHaveTextContent('collect data');
});

test('a plain visit leaves the address bar alone', () => {
  renderApp();
  expect(window.location.search).toBe('');
});

test('switching to the table of contents lists every entry and updates the link', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /show table of contents/i }));

  expect(screen.getByText('Table of Contents')).toBeInTheDocument();
  expect(screen.queryByTestId('tree')).not.toBeInTheDocument();
  // one Docs/Videos-free label per entry: every entry has its name in the list
  expect(screen.getAllByText(/./, { selector: '.sub-item > span:first-child' })).toHaveLength(51);
  expect(window.location.search).toContain('tocMode=true');

  fireEvent.click(screen.getByRole('button', { name: /show tree/i }));
  expect(screen.getByTestId('tree')).toBeInTheDocument();
  expect(window.location.search).toContain('tocMode=false');
});

test('a shared link opens straight into the table of contents', () => {
  window.history.replaceState({}, '', '/?tocMode=true&depth=3');
  renderApp();
  expect(screen.getByText('Table of Contents')).toBeInTheDocument();
});

test('a video link plays in a modal with a referrer policy, and Close ends it', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /show table of contents/i }));
  fireEvent.click(screen.getAllByRole('link', { name: /videos/i })[0]);

  const dialog = screen.getByRole('dialog');
  const frame = within(dialog).getByTitle('YouTube video player');
  expect(frame.getAttribute('src')).toMatch(/^https:\/\/www\.youtube\.com\/embed\//);
  expect(frame).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

  fireEvent.click(within(dialog).getByRole('button', { name: /close/i }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('About plays the intro video', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /about/i }));
  expect(within(screen.getByRole('dialog')).getByTitle('YouTube video player').getAttribute('src'))
    .toContain('iyLrL-S0UjM');
});
