/*global cy, it, describe*/
import VideoModal from './VideoModal';

describe('<VideoModal />', () => {
  it('renders nothing when url is null', () => {
    cy.mount(<VideoModal url={null} onClose={cy.stub()} />);
    cy.get('[data-cy="video-iframe"]').should('not.exist');
  });

  it('renders iframe and calls onClose on close button click', () => {
    const onClose = cy.stub().as('onClose');
    const testUrl = 'https://www.youtube.com/embed/iyLrL-S0UjM?autoplay=1';

    cy.mount(<VideoModal url={testUrl} onClose={onClose} />);
    cy.get('[data-cy="video-iframe"]').should('have.attr', 'src', testUrl);
    cy.get('[data-cy="modal-close"]').click();
    cy.get('@onClose').should('have.been.calledOnce');
  });
});
