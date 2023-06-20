describe('Patient granting access', () => {
    beforeEach(() => {
        // login as patient1
        cy.visit('/');
        cy.contains('span', 'Login').click();
        cy.get("input[ng-reflect-name='username']").click().wait(500).type('patient1');
        cy.get("input[ng-reflect-name='password']").click().wait(500).type('password');
        cy.contains('mat-dialog-container span', 'Login').click();
    });

    it('Patient can grant access to doctor', () => {

        cy.contains('span', 'Grant access to doctor').click();

        // cy.contains('td span', "Grant access").first().click()
        cy.get('table tr:nth-child(1) td span:contains("Grant access")').click(); // button in first row

        cy.wait(1000);

        cy.get('mat-calendar').contains(30).click();

        cy.wait(1000);
    });


});

describe('Patient personal data', () => {
    beforeEach(() => {
        // login as patient1
        cy.visit('/');
        cy.contains('span', 'Login').click();
        cy.get("input[ng-reflect-name='username']").click().wait(500).type('patient1');
        cy.get("input[ng-reflect-name='password']").click().wait(500).type('password');
        cy.contains('mat-dialog-container span', 'Login').click();
    });

    it('Patient can edit his personal data', () => {

        cy.contains('span', 'Edit').click();

        cy.get('input[formcontrolname="firstName"]').clear().type('New name');
        cy.get('input[formcontrolname="lastName"]').clear().type('New last name');
        cy.get('input[formcontrolname="age"]').clear().type('50');

        cy.get('mat-select[formcontrolname="gender"]').click(); // Click on the select field
        cy.get('mat-option[value="male"]').click(); // Select the "male" option

        cy.get('input[formcontrolname="address"]').clear().type('New address');
        cy.get('input[formcontrolname="phoneNumber"]').clear().type('111111');
        // cy.get('input[formcontrolname="specialization"]').clear().type('New Name');

        cy.get('input[formcontrolname="password"]').type('password');

        cy.contains('button', 'Edit').click();


        cy.contains('span', 'First name:').should('contain.text', 'First name: New name');
        cy.contains('span', 'Last name:').should('contain.text', 'Last name: New last name');
        cy.contains('span', 'Age:').should('contain.text', 'Age: 50');
        cy.contains('span', 'Address:').should('contain.text', 'Address: New address');
        cy.contains('span', 'Phone Number:').should('contain.text', 'Phone Number: 111111');
        cy.contains('span', 'Gender:').should('contain.text', 'Gender: male');
    });
})

// describe('Patient', () => {
//     beforeEach(() => {
//         // login as patient1
//         cy.visit('/');
//         cy.contains('span', 'Login').click();
//         cy.get("input[ng-reflect-name='username']").click().wait(500).type('patient1');
//         cy.get("input[ng-reflect-name='password']").click().wait(500).type('password');
//         cy.contains('mat-dialog-container span', 'Login').click();
//     });
// })

describe('Doctor adding medical data', () => {
    beforeEach(() => {
        // login as doctor1
        cy.visit('/');
        cy.contains('span', 'Login').click();
        cy.get("input[ng-reflect-name='username']").click().wait(500).type('doctor1');
        cy.get("input[ng-reflect-name='password']").click().wait(500).type('password');
        cy.contains('mat-dialog-container span', 'Login').click();
    });

    it('Doctor should have access to patient', () => {
        cy.contains('span', 'Your patients').click();
        cy.contains('.mat-mdc-cell', 'patient1').should('contain.text', 'patient1')
    })

    it('Doctor can add patient medical data', () => {
        cy.contains('span', 'Your patients').click();

        cy.contains('.mat-mdc-cell', 'patient1').click();
        cy.wait(1000);

        cy.contains('label', 'allergy0').next('input').type('testValue1');
        cy.contains('label', 'condition0').next('input').type('testValue1');
        cy.contains('label', 'medication0').next('input').type('testValue1');
        cy.contains('label', 'treatment plans').next('textarea').type('testValue1');

        cy.contains('button', 'Create diagnosis').click();
        cy.get('mat-spinner').should('not.exist');


        cy.contains('p', 'Allergies:').next().should('contain.text', 'testValue1');
        cy.contains('p', 'Conditions:').next().should('contain.text', 'testValue1');
        cy.contains('p', 'Medications:').next().should('contain.text', 'testValue1');
        cy.contains('p', 'Treatment Plans: ').should('contain.text', 'testValue1');
    });


});

describe('Doctor personal data', () => {
    beforeEach(() => {
        // login as doctor1
        cy.visit('/');
        cy.contains('span', 'Login').click();
        cy.get("input[ng-reflect-name='username']").click().wait(500).type('doctor1');
        cy.get("input[ng-reflect-name='password']").click().wait(500).type('password');
        cy.contains('mat-dialog-container span', 'Login').click();
    });

    it('Doctor can edit his personal data', () => {

        cy.contains('span', 'Edit').click();;

        cy.get('input[formcontrolname="firstName"]').clear().type('New name');
        cy.get('input[formcontrolname="lastName"]').clear().type('New last name');
        cy.get('input[formcontrolname="age"]').clear().type('50');

        cy.get('mat-select[formcontrolname="gender"]').click();
        cy.get('mat-option[value="male"]').click();

        cy.get('input[formcontrolname="address"]').clear().type('New address');
        cy.get('input[formcontrolname="phoneNumber"]').clear().type('111111');
        cy.get('input[formcontrolname="specialization"]').clear().type('New specialization');

        cy.get('input[formcontrolname="password"]').type('password');

        cy.contains('button', 'Edit').click();


        cy.contains('span', 'First name:').should('contain.text', 'First name: New name');
        cy.contains('span', 'Last name:').should('contain.text', 'Last name: New last name');
        cy.contains('span', 'Age:').should('contain.text', 'Age: 50');
        cy.contains('span', 'Address:').should('contain.text', 'Address: New address');
        cy.contains('span', 'Phone Number:').should('contain.text', 'Phone Number: 111111');
        cy.contains('span', 'Gender:').should('contain.text', 'Gender: male');
        cy.contains('span', 'Specialization:').should('contain.text', 'Specialization: New specialization');

    });

})

// describe('Doctor', () => {
//     beforeEach(() => {
//         // login as doctor1
//         cy.visit('/');
//         cy.contains('span', 'Login').click();
//         cy.get("input[ng-reflect-name='username']").click().wait(500).type('doctor1');
//         cy.get("input[ng-reflect-name='password']").click().wait(500).type('password');
//         cy.contains('mat-dialog-container span', 'Login').click();
//     });

// })

describe('Patient revoking access', () => {
    beforeEach(() => {
        // login as patient1
        cy.visit('/');
        cy.contains('span', 'Login').click();
        cy.get("input[ng-reflect-name='username']").click().wait(500).type('patient1');
        cy.get("input[ng-reflect-name='password']").click().wait(500).type('password');
        cy.contains('mat-dialog-container span', 'Login').click();
    });

    it('Patient can revoke access from doctor', () => {

        cy.contains('span', 'Grant access to doctor').click();

        cy.get('table tr:nth-child(1) td span:contains("Revoke access")').click(); // button in first row
    });

})
