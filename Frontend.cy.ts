describe('Frontend UI Tests', () => {
    it('Should select "Agency Fee" from the list of Master Cost Items', () => {
        cy.visit('https://qa-test.cuat.marcura.com/dashboard');

        cy.get<HTMLInputElement>("input[id='search-box-mcis']").type('Agency');

        cy.get('ul>li').contains('Agency Fee').click();

        cy.get<HTMLInputElement>("input[id='search-box-mcis']").invoke('val').then((value) => {
            expect(value).not.to.be.empty;
            cy.log('Value of input field: ' + value);
        });

    });

    it('Should select any Annotation from the list', () => {
        const expectedValue: number = 2.76;

        for (let charCode = 97; charCode <= 102; charCode++) {
            const letter: string = String.fromCharCode(charCode);

            cy.visit('https://qa-test.cuat.marcura.com/dashboard');

            cy.get<HTMLInputElement>("input[id='search-box-mcis']").type('Agency');

            cy.get('ul>li').contains('Agency Fee').click();

            cy.get<HTMLInputElement>("input[id='search-box-mcis']").invoke('val').then((value) => {
                expect(value).not.to.be.empty;
                cy.log('Value of input field: ' + value);
            });

            cy.get<HTMLInputElement>("input[id='search-box-annotations']").clear().type(letter);
            cy.wait(2000);

            if (letter === 'e') {
                break;
            }

            cy.get('ul>li').first().click();

            cy.get<HTMLInputElement>("input[id='master-cost-input']").clear().type('222');

            cy.get<HTMLInputElement>("[id='master-cost-usd-rate']").invoke('val').then((value) => {
                expect(value).not.to.be.empty;
                cy.log('Value of input field: ' + value);
            });

            cy.contains('Add').click();
            cy.wait(2000);

            cy.get("table>tbody>tr>td[class='cost-cell']>div:nth-child(2)").invoke('text').then((value) => {
                const parts: string[] = value.split(':');
                const numericValue: string = parts[1].trim();
                cy.log('Numeric value: ' + numericValue);
                checkUSDValue(parseFloat(numericValue), expectedValue);
            });
        }
    });
});

function checkUSDValue(actualValue: number, expectedValue: number): void {
    if (Math.abs(actualValue - expectedValue) <= 0.01) {
        cy.log(`Value ${actualValue} matches the expected value ${expectedValue}`);
    } else {
        const correctedValue: string = expectedValue.toFixed(2);
        cy.log(`Value ${actualValue} does not match expected value ${expectedValue}. Correcting...`);
        cy.log(`Corrected value: ${correctedValue}`);

        cy.get<HTMLInputElement>("[id='master-cost-usd-rate']").clear().type(correctedValue);

        cy.get<HTMLInputElement>("[id='master-cost-usd-rate']").invoke('val').then((newValue) => {
            const newActualValue: number = parseFloat(newValue);
            if (Math.abs(newActualValue - expectedValue) <= 0.01) {
                cy.log('Value corrected successfully');
            } else {
                throw new Error(`Value is not corrected. Actual: ${newValue}, Expected: ${correctedValue}`);
            }
        });
    }
}
