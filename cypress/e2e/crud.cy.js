describe('CRUD Operations', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000');
    // Login as admin
    cy.contains('Sign In').click();
    cy.wait(500);
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('admin123');
    cy.get('#loginSection button[type="submit"]').click();
    cy.get('#navDashboard', { timeout: 5000 }).should('have.css', 'display', 'block');
  });

  describe('Book Management', () => {
    it('should add a new book', () => {
      cy.contains('Add Book').click();
      cy.wait(300);
      cy.get('#bookTitle').type('Test Book ' + Date.now());
      cy.get('#bookAuthor').type('Test Author');
      cy.get('#bookISBN').type('978-3-16-148410-' + Math.floor(Math.random() * 100));
      cy.get('#bookGenre').select('Fiction');
      cy.get('#bookQuantity').clear().type('5');
      cy.get('#addBookSection button[type="submit"]').click();
      cy.contains('Book added successfully', { timeout: 5000 }).should('be.visible');
    });

    it('should view all books', () => {
      cy.contains('Browse Books').click();
      cy.wait(500);
      cy.get('#booksList').should('exist');
    });

    it('should search for a book', () => {
      cy.contains('Browse Books').click();
      cy.wait(500);
      cy.get('#searchBooks').type('Fiction', { delay: 100 });
      cy.wait(300);
      cy.get('.book-item').should('have.length.greaterThan', 0);
    });
  });

  describe('User Management', () => {
    it('should open manage users modal', () => {
      cy.get('#navManageUsers').should('have.css', 'display', 'block');
      cy.contains('Manage Users').click();
      cy.wait(500);
      cy.get('#manageUsersModal').should('be.visible');
    });

    it('should display list of users', () => {
      cy.contains('Manage Users').click();
      cy.wait(500);
      cy.get('.user-row').should('have.length.greaterThan', 0);
    });
  });

  describe('Statistics', () => {
    it('should display dashboard statistics', () => {
      cy.wait(500);
      cy.contains('Total Books').should('be.visible');
      cy.contains('Books Borrowed').should('be.visible');
      cy.contains('Active Members').should('be.visible');
    });

    it('should show stat cards', () => {
      cy.wait(300);
      cy.get('.stat-card').should('have.length', 4);
      cy.get('.stat-value').should('be.visible');
    });
  });
});
