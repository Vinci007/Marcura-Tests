// PublicApi Test Scenarios 

describe('Public API Tests', () => {
  it('Should return 200 status code', () => {
    cy.request('GET', 'https://exchange.da-desk.com/agency-api/1.1/info')
      .its('status')
      .should('eq', 200);
  });

  it('Should have non-null values for name, telephone, fax, and email properties', () => {
    cy.request('GET', 'https://exchange.da-desk.com/agency-api/1.1/info')
      .its('body')
      .then((response: any) => {
        expect(response).to.have.property('name').that.is.not.null;
        expect(response).to.have.property('telephone').that.is.not.null;
        expect(response).to.have.property('fax').that.is.not.null;
        expect(response).to.have.property('email').that.is.not.null;
      });
  });

  it('Should have correct media type in response', () => {
    cy.request('GET', 'https://exchange.da-desk.com/agency-api/1.1/info')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json');
  });
});
