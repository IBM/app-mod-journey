/*global cy, expect*/
import { SEL_TOC, SEL_TOC_TITLE, SEL_TOC_TITLE_TEXT } from '../support/constants/constants.js';

describe('Application Modernization Playbook E2E', () => {
  it('passes accessibility compliance on landing page and Table of Contents', () => {
    cy.playbook()
      .getCompliance('getCOD Landing page')
      .then((report) => {
        expect(report.results).to.have.lengthOf(0);
      });

    cy.get(SEL_TOC).click({ force: true });
    cy.get(SEL_TOC_TITLE)
      .contains(SEL_TOC_TITLE_TEXT)
      .getCompliance('getTOC compliance report')
      .then((report) => {
        expect(report.results).to.have.lengthOf(0);
      });
  });

  it('navigates tree nodes and updates URL selection state', () => {
    cy.playbook();
    cy.get('.tree-container').should('be.visible');

    // Root node is visible and primary
    cy.contains('.node-textContainer span', 'collect data').should('be.visible');

    // Click child node B1 "from Application Binaries" in the tree
    cy.contains('.node-textContainer span', 'from Application Binaries').click({ force: true });
    cy.url().should('include', 'primaryData=');
  });

  it('toggles view controls between Table of Contents and Tree view', () => {
    cy.playbook();

    // Switch to TOC view
    cy.get(SEL_TOC).click();
    cy.get(SEL_TOC_TITLE).should('contain', SEL_TOC_TITLE_TEXT);
    cy.get('.tree--action-controls-hide').should('exist');

    // Switch back to Tree view
    cy.get(SEL_TOC).click();
    cy.get('.tree-container').should('be.visible');
    cy.get('.tree--action-controls').should('be.visible');

    // Toggle branches (starts true -> "Hide unselected nodes"; clicking toggles to "Show unselected nodes")
    cy.get('[data-cy="toggle-branches"]').should('contain', 'Hide unselected nodes').click();
    cy.get('[data-cy="toggle-branches"]').should('contain', 'Show unselected nodes');

    // Toggle tree expansion (starts false -> "Expand tree view"; clicking toggles to "Collapse tree view")
    cy.get('[data-cy="toggle-expand"]').should('contain', 'Expand tree view').click();
    cy.get('[data-cy="toggle-expand"]').should('contain', 'Collapse tree view');
  });

  it('restores state from deep-link shared URLs', () => {
    // Deep-link to Table of Contents
    cy.visit('/?tocMode=true');
    cy.get(SEL_TOC_TITLE).should('contain', SEL_TOC_TITLE_TEXT);

    // Deep-link to specific selected node B1
    cy.visit('/?primaryData=%5B%22B1%22%5D&tocMode=false');
    cy.get('.tree-container').should('be.visible');
    cy.contains('.node-textContainer span', 'from Application Binaries').should('be.visible');
  });

  it('opens and closes video modals from Header About and node links', () => {
    cy.playbook();

    // Open About video from Header
    cy.get('[data-cy="header-about"]').click();
    cy.get('[data-cy="video-iframe"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'iyLrL-S0UjM');

    // Close modal
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="video-iframe"]').should('not.exist');

    // Open video from TOC item
    cy.get(SEL_TOC).click();
    cy.contains('[data-cy="toc-item"]', 'using WSADMIN Command')
      .find('[data-cy="toc-video-link"]')
      .click();
    cy.get('[data-cy="video-iframe"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="video-iframe"]').should('not.exist');
  });
});
