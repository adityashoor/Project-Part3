// Cypress support file
// This file is processed and loaded automatically before your test files

// Disable uncaught exception handling for test stability
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});

// Custom commands can be added here
Cypress.Commands.add('login', (email, password) => {
  cy.contains('Sign In').click();
  cy.get('#loginEmail').type(email);
  cy.get('#loginPassword').type(password);
  cy.get('button[type="submit"]').contains('Sign In').click();
});

Cypress.Commands.add('logout', () => {
  cy.contains('Sign Out').click();
  cy.on('window:confirm', () => true);
});

Cypress.Commands.add('registerUser', (firstName, lastName, email, password, phone) => {
  cy.contains('Sign Up').click();
  cy.get('#regFirstName').type(firstName);
  cy.get('#regLastName').type(lastName);
  cy.get('#regEmail').type(email);
  cy.get('#regPassword').type(password);
  cy.get('#regPhone').type(phone);
  cy.get('button[type="submit"]').contains('Create Account').click();
});
