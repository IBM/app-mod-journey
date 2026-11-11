import { useEffect } from 'react';

/**
 * react-d3-tree renders its own <svg>, which has no accessible name. Label it once it exists.
 * Runs after every render, because the tree replaces the svg when it is rebuilt.
 */
export default function useSvgAriaLabel(selector, label) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      const svg = document.querySelector(selector);
      if (svg && !svg.getAttribute('aria-label')) {
        svg.setAttribute('aria-label', label);
        svg.setAttribute('role', 'img');
      }
    }, 100);
    return () => clearTimeout(timerId);
  });
}
