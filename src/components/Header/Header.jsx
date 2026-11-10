import React from 'react';
import {DecisionTree} from '@carbon/icons-react';
import './header.css';

const SITE = 'https://ibm.github.io/app-mod-journey/details';

const EXTERNAL_LINKS = [
  {label: 'FAQ', href: `${SITE}/faq`},
  {label: 'Testimonials', href: `${SITE}/customerTestimonials`},
  {label: 'Install', href: `${SITE}/install`},
  {label: 'About', action: 'about'},
  {label: 'Privacy', href: `${SITE}/privacy`},
  {label: 'Contribute', href: 'https://github.com/IBM/app-mod-journey/tree/main'}
];

/**
 * @param {Object} props
 * @param {() => void} props.aboutClick opens the About dialog
 * @param {() => void} props.headerClick returns to the starting page
 */
export default function Header({aboutClick, headerClick}) {
  return (
    <header className='header'>
      <button data-cy='header-home' type='button' className='title-wrapper' onClick={headerClick}>
        <DecisionTree size={32} aria-hidden='true'/>
        <span className='title-header'>Java Application Modernization Playbook</span>
      </button>
      <nav aria-label='Playbook links'>
        <ul className='additional-header-links'>
          {EXTERNAL_LINKS.map(({label, href, action}) => (
            <li key={label}>
              {action === 'about' ? (
                <button data-cy='header-about' type='button' className='header-link-button' onClick={aboutClick}>{label}</button>
              ) : (
                <a target='_blank' rel='noopener noreferrer' href={href}>{label}</a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
