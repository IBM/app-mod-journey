/*global cy*/
const Constants = require('../support/constants/constants');
const {SEL_TOC_TITLE_TEXT} = require("../support/constants/constants");
describe('app mod page test', function() {
    it('go to playbook page', () => {
        cy.playbook()
            .getCompliance('getCOD Landing page')
            .then((report) => {
                expect(report.results).to.have.lengthOf(0);
            });

        cy.get(Constants.SEL_TOC).click({force:true});
        cy.get(Constants.SEL_TOC_TITLE).contains(SEL_TOC_TITLE_TEXT)
            .getCompliance('getTOC compliance report')
            .then((report) => {
                expect(report.results).to.have.lengthOf(0);
            });
    });
});