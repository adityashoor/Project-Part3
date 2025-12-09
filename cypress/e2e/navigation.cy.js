describe('Navigation and Role-Based Access', () => {
  describe('Public Navigation', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8000');
    });

    it('should display public navigation menu', () => {
      cy.get('.sidebar').should('be.visible');
      cy.get('#navSignIn').should('have.css', 'display', 'block');
      cy.get('#navSignUp').should('have.css', 'display', 'block');
    });

    it('should navigate to sign in page', () => {
      cy.contains('Sign In').click();
      cy.get('#loginSection').should('have.class', 'active');
    });

    it('should navigate to sign up page', () => {
      cy.contains('Sign Up').click();
      cy.get('#registerSection').should('have.class', 'active');
    });

    it('should navigate to home', () => {
      cy.contains('Home').click();
      cy.get('#home').should('have.class', 'active');
      cy.contains('Welcome to LibraryHub').should('be.visible');
    });
  });

  describe('Authenticated User Navigation', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8000');
      cy.contains('Sign In').click();
      cy.wait(500);
      cy.get('#loginEmail').type('user@test.com');
      cy.get('#loginPassword').type('user123');
      cy.get('#loginSection button[type="submit"]').click();
      cy.get('#navDashboard', { timeout: 5000 }).should('have.css', 'display', 'block');
    });

    it('should display authenticated navigation', () => {
      cy.get('#navDashboard').should('have.css', 'display', 'block');
      cy.get('#navBooks').should('have.css', 'display', 'block');
      cy.get('#navMyBooks').should('have.css', 'display', 'block');
      cy.get('#navProfile').should('have.css', 'display', 'block');
    });

    it('should navigate to dashboard', () => {
      cy.contains('Dashboard').click();
      cy.wait(300);
      cy.get('#dashboard').should('have.class', 'active');
    });

    it('should navigate to books', () => {
      cy.contains('Browse Books').click();
      cy.wait(300);
      cy.get('#booksList').should('exist');
    });

    it('should navigate to profile', () => {
      cy.contains('My Profile').click();
      cy.wait(300);
      cy.get('#profile').should('have.class', 'active');
    });

    it('should not see add book button', () => {
      cy.get('#navAddBook').should('have.css', 'display', 'none');
    });

    it('should not have manage users option', () => {
      cy.get('#navManageUsers').should('have.css', 'display', 'none');
    });
  });

  describe('Admin Navigation and Permissions', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8000');
      cy.contains('Sign In').click();
      cy.wait(500);
      cy.get('#loginEmail').type('admin@test.com');
      cy.get('#loginPassword').type('admin123');
      cy.get('#loginSection button[type="submit"]').click();
      cy.get('#navDashboard', { timeout: 5000 }).should('have.css', 'display', 'block');
    });

    it('should display admin navigation menu', () => {
      cy.get('#navDashboard').should('have.css', 'display', 'block');
      cy.get('#navBooks').should('have.css', 'display', 'block');
      cy.get('#navAddBook').should('have.css', 'display', 'block');
      cy.get('#navManageUsers').should('have.css', 'display', 'block');
    });

    it('should have access to add book functionality', () => {
      cy.get('#navAddBook').should('have.css', 'display', 'block');
    });

    it('should have access to manage users', () => {
      cy.get('#navManageUsers').should('have.css', 'display', 'block');
      cy.contains('Manage Users').click();
      cy.wait(500);
      cy.get('#manageUsersModal').should('be.visible');
    });

    it('should navigate to all pages', () => {
      cy.contains('Dashboard').click();
      cy.wait(300);
      cy.get('#dashboard').should('have.class', 'active');

      cy.contains('Browse Books').click();
      cy.wait(300);
      cy.get('#booksList').should('exist');

      cy.contains('Add Book').click();
      cy.wait(300);
      cy.get('#addBookSection').should('have.class', 'active');
    });
  });

  describe('Responsive Navigation', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8000');
    });

    it('should render properly on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.get('.sidebar').should('be.visible');
      cy.get('#navSignIn').should('have.css', 'display', 'block');
    });

    it('should render properly on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.get('.sidebar').should('be.visible');
    });

    it('should render properly on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('.sidebar').should('be.visible');
    });
  });

  describe('Page Access Control', () => {
    it('should redirect to home/login when not authenticated', () => {
      cy.visit('http://localhost:8000#dashboard');
      cy.get('#loginSection').should('have.class', 'active');
    });

    it('should not allow regular user to see add book menu', () => {
      cy.visit('http://localhost:8000');
      cy.contains('Sign In').click();
      cy.wait(500);
      cy.get('#loginEmail').type('user@test.com');
      cy.get('#loginPassword').type('user123');
      cy.get('#loginSection button[type="submit"]').click();
      cy.get('#navDashboard', { timeout: 5000 }).should('have.css', 'display', 'block');
      cy.get('#navAddBook').should('have.css', 'display', 'none');
    });

    it('should redirect to home after logout', () => {
      cy.visit('http://localhost:8000');
      cy.contains('Sign In').click();
      cy.wait(500);
      cy.get('#loginEmail').type('admin@test.com');
      cy.get('#loginPassword').type('admin123');
      cy.get('#loginSection button[type="submit"]').click();
      cy.get('#navDashboard', { timeout: 5000 }).should('have.css', 'display', 'block');

      cy.get('#navLogout a').click({ force: true });
      cy.on('window:confirm', () => true);

      cy.get('#navHome', { timeout: 5000 }).should('have.css', 'display', 'block');
      cy.contains('Welcome to LibraryHub').should('be.visible');
    });
  });
});
