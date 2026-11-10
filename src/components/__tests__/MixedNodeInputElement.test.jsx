import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MixedNodeElement from '../MixedNodeInputElement';

describe('MixedNodeInputElement component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders node name and triggers selection on click', () => {
    const changePrimary = vi.fn();
    const appState = { changePrimary, playVideo: vi.fn() };
    const nodeData = { name: 'collect data', primary: true };

    render(
      <svg>
        <MixedNodeElement appState={appState} nodeData={nodeData} />
      </svg>
    );

    const nodeButton = screen.getByText('collect data');
    expect(nodeButton).toBeInTheDocument();
    expect(nodeButton).toHaveAttribute('role', 'button');
    expect(nodeButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(nodeButton);
    expect(changePrimary).toHaveBeenCalledWith('collect data');
  });

  it('triggers selection when pressing Enter or Space key', () => {
    const changePrimary = vi.fn();
    const appState = { changePrimary, playVideo: vi.fn() };
    const nodeData = { name: 'from Application Binaries', primary: false };

    render(
      <svg>
        <MixedNodeElement appState={appState} nodeData={nodeData} />
      </svg>
    );

    const nodeButton = screen.getByText('from Application Binaries');

    fireEvent.keyDown(nodeButton, { key: 'Enter' });
    expect(changePrimary).toHaveBeenCalledWith('from Application Binaries');

    fireEvent.keyDown(nodeButton, { key: ' ' });
    expect(changePrimary).toHaveBeenCalledTimes(2);
  });

  it('shows description tooltip on hover when enableDescriptions is true', () => {
    const appState = { changePrimary: vi.fn(), playVideo: vi.fn() };
    const nodeData = {
      name: 'Test Node',
      description: 'Detailed description for test node',
      primary: false,
    };

    render(
      <svg>
        <MixedNodeElement
          appState={appState}
          nodeData={nodeData}
          enableDescriptions={true}
        />
      </svg>
    );

    const nodeButton = screen.getByText('Test Node');

    fireEvent.mouseEnter(nodeButton);
    expect(screen.queryByText('Detailed description for test node')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText('Detailed description for test node')).toBeInTheDocument();

    fireEvent.mouseLeave(nodeButton);
    expect(screen.queryByText('Detailed description for test node')).not.toBeInTheDocument();
  });
});
