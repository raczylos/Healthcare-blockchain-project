describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('span', "Login").click()
    cy.get("input[ng-reflect-name='username']").click().type("patient1")

    cy.get("input[ng-reflect-name='password']").click().type("password")

    cy.contains('mat-dialog-container span', "Login").click()

    cy.contains('span', "Grant access to doctor").click()

    // cy.contains('td span', "Grant access").first().click()
    cy.get('table tr:nth-child(1) td span:contains("Grant access")').click(); // button in first row

    //expect

    // cy.contains('mat-calendar button', "30").click()

    cy.wait(1000);

    cy.get('mat-calendar').find(`button[aria-label="April 30, 2023"]`).click()
  })
})
