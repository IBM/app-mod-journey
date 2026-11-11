/*global cy, it, describe*/
import Header from './Header';

describe('<Header />', () => {
  it('renders title and triggers callback clicks', () => {
    const onAbout = cy.stub().as('onAbout');
    const onHome = cy.stub().as('onHome');

    cy.mount(<Header aboutClick={onAbout} headerClick={onHome} />);

    cy.get('[data-cy="header-home"]')
      .should('contain', 'Java Application Modernization Playbook')
      .click();
    cy.get('@onHome').should('have.been.calledOnce');

    cy.get('[data-cy="header-about"]').click();
    cy.get('@onAbout').should('have.been.calledOnce');
  });
});
