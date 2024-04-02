/// <reference types="cypress" />

describe('Non-Public API Tests', () => {
  it('Should redirect to authentication failed response with 401 status code', () => {
    cy.request({
      method: 'GET',
      url: 'https://exchange.da-desk.com/agency-api/1.1/search/masterCostItems',
      failOnStatusCode: false,
      qs: {
        name: 'test',
        token: '123',
        serviceId: 'web/edge',
        serviceVersion: '1.5.18.2'
      },
      followRedirect: false // Prevent Cypress from following redirects
    }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.redirectedToUrl).to.include('/authentication_failed');
    });
  });

  it('Should have different results for different "name" parameters', () => {
      const name1: string = 'test1';
      const name2: string = 'test2';
    
      cy.request({
        method: 'GET',
        url: 'https://exchange.da-desk.com/agency-api/1.1/search/masterCostItems',
        failOnStatusCode: false,
        qs: {
          name: name1,
          token: '123',
          serviceId: 'web/edge',
          serviceVersion: '1.5.18.2'
        }
      }).then((response1) => {
        // Check results for name1
        expect(response1.status).to.equal(200);
        // Add more assertions if needed for name1
    
        // Send request for name2
        cy.request({
          method: 'GET',
          url: 'https://exchange.da-desk.com/agency-api/1.1/search/masterCostItems',
          failOnStatusCode: false,
          qs: {
            name: name2,
            token: '123',
            serviceId: 'web/edge',
            serviceVersion: '1.5.18.2'
          }
        }).then((response2) => {
          // Check results for name2
          expect(response2.status).to.equal(200);
          // Add more assertions if needed for name2
    
          // Compare responses if necessary
          expect(response1.body).not.to.deep.equal(response2.body);
        });
      });
    });
    
  it('Should return a valid response with 200 status code', () => {
      cy.request('GET', 'https://exchange.da-desk.com/agency-api/1.1/search/masterCostItems')
        .then((response) => {
          expect(response.status).to.equal(200);
        });
    });
  
  it('Should have "Date" property in response headers', () => {
      cy.request('GET', 'https://exchange.da-desk.com/agency-api/1.1/search/masterCostItems')
        .its('headers')
        .its('date')
        .should('not.be.empty');
    });
  
  it('Should format "Date" to current Indian timezone if necessary', () => {
      cy.request('GET', 'https://exchange.da-desk.com/agency-api/1.1/search/masterCostItems')
        .its('headers')
        .its('date')
        .then((dateString: string) => {
          const date: Date = new Date(dateString);
          const formattedDate: string = date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
          expect(formattedDate).to.not.be.null;
        });
    });
});
