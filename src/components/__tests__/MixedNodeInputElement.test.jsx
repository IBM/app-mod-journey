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

    const nodeText = screen.getByText('collect data');
    expect(nodeText).toBeInTheDocument();

    fireEvent.click(nodeText);
    expect(changePrimary).toHaveBeenCalledWith('collect data');
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
