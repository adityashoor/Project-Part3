describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000');
  });

  it('should display landing page', () => {
    cy.contains('Welcome to LibraryHub').should('be.visible');
    cy.contains('Team Raw').should('be.visible');
  });

  it('should register a new user', () => {
    cy.contains('Sign Up').click();
    cy.wait(500);
    cy.get('#regFirstName').type('TestUser');
    cy.get('#regLastName').type('E2E');
    cy.get('#regEmail').type('testuser' + Date.now() + '@example.com');
    cy.get('#regPassword').type('password123');
    cy.get('#regPhone').type('1234567890');
    cy.get('#registerSection button[type="submit"]').click();
    cy.contains('Registration successful', { timeout: 5000 }).should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.contains('Sign In').click();
    cy.wait(500);
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('admin123');
    cy.get('#loginSection button[type="submit"]').click();
    cy.get('#navDashboard', { timeout: 5000 }).should('have.css', 'display', 'block');
  });

  it('should fail login with incorrect password', () => {
    cy.contains('Sign In').click();
    cy.wait(500);
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('wrongpassword');
    cy.get('#loginSection button[type="submit"]').click();
    cy.contains('Login failed', { timeout: 5000 }).should('be.visible');
  });

  it('should logout successfully', () => {
    // Login first
    cy.contains('Sign In').click();
    cy.wait(500);
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('admin123');
    cy.get('#loginSection button[type="submit"]').click();
    cy.get('#navDashboard', { timeout: 5000 }).should('have.css', 'display', 'block');

    // Logout
    cy.get('#navLogout').should('have.css', 'display', 'block');
    cy.get('#navLogout a').click({ force: true });
    cy.on('window:confirm', () => true);
    cy.get('#navHome', { timeout: 5000 }).should('have.css', 'display', 'block');
  });
});
