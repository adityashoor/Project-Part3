# COMP229 Part 4 – Final Release Implementation Guide
## Library Management System - LibraryHub by Team Raw

---

## 1. FUNCTIONAL COMPLETENESS & DESIGN POLISH

### Current Status
✓ Authentication & Authorization (Login/Register/Sign Out)
✓ Navigation (role-based, responsive)
✓ Landing Page (Home with Team Raw branding)
✓ Browse Books (search, filter, details modal)
✓ My Books (borrow/return tracking)
✓ Add Book (admin/librarian)
✓ Manage Users (admin CRUD)
✓ User Profile (update personal info)
✓ Responsive Design (desktop, tablet, mobile)

### Final Polish Checklist
- [ ] Review all form validations
- [ ] Test error handling and user feedback (toast messages)
- [ ] Ensure consistent color scheme across pages
- [ ] Optimize whitespace and typography
- [ ] Test all buttons and navigation links
- [ ] Verify responsive design on mobile devices
- [ ] Check accessibility (alt text, labels)
- [ ] Remove console errors/warnings
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)

---

## 2. UNIT TESTING (Backend)

### Setup Jest & Supertest

```bash
cd backend
npm install --save-dev jest supertest
```

### Create test files:

**backend/tests/auth.test.js** - Test registration, login, JWT
**backend/tests/books.test.js** - Test CRUD operations
**backend/tests/controllers.test.js** - Test business logic

### Example Test:
```javascript
describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
```

### Run Tests:
```bash
npm test
```

### Capture Screenshots:
- Terminal output showing test results
- Coverage report (npm test -- --coverage)

---

## 3. END-TO-END (E2E) TESTING WITH CYPRESS

### Install Cypress
```bash
npm install --save-dev cypress
npx cypress open
```

### Create E2E Test Scenarios:

**cypress/e2e/login.cy.js**
```javascript
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('http://localhost:8000');
    cy.get('#loginEmail').type('admin@test.com');
    cy.get('#loginPassword').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.contains('Dashboard').should('be.visible');
  });
});
```

**cypress/e2e/books.cy.js**
```javascript
describe('Book Management', () => {
  it('should browse and filter books', () => {
    cy.login(); // Custom command
    cy.visit('http://localhost:8000');
    cy.get('#searchInput').type('Harry');
    cy.get('.book-card').should('exist');
  });
});
```

**cypress/e2e/crud.cy.js**
```javascript
describe('CRUD Operations', () => {
  it('should create, read, update, delete a book', () => {
    // Create
    // Read
    // Update
    // Delete
  });
});
```

### Run Cypress:
```bash
npx cypress run --record  // Record video
npx cypress open         // Interactive mode
```

### Deliverables:
- Screenshot of test results (passing/failing)
- Cypress test code (saved in repo)
- Video recording of test run

---

## 4. PERFORMANCE OPTIMIZATION

### Frontend Optimization:
1. **Minify CSS/JS**: Use webpack or build tools
2. **Lazy Load Images**: Use `loading="lazy"`
3. **Optimize Bundle**: Remove unused dependencies
4. **Cache Strategy**: Leverage browser caching
5. **Reduce API Calls**: Batch requests where possible

### Backend Optimization:
1. **Database Indexes**: Ensure indexes on frequently queried fields
2. **Query Optimization**: Use lean() in Mongoose for read-only queries
3. **Compression**: Enable gzip compression in Express
4. **Rate Limiting**: Add rate limiter middleware
5. **Connection Pooling**: MongoDB Atlas handles this

### Performance Metrics:
- Check with Chrome DevTools (Lighthouse)
- Target: >90 Lighthouse score
- Load time < 3 seconds
- API response time < 500ms

---

## 5. CLOUD DEPLOYMENT

### Option A: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Deploy Backend to Railway
```bash
# Push code to GitHub
# Connect GitHub repo to Railway
# Set environment variables (MONGODB_URI, JWT_SECRET)
# Deploy automatically
```

#### MongoDB Atlas Setup
1. Create account at mongodb.com/cloud
2. Create cluster
3. Add whitelist IP (0.0.0.0/0 for testing)
4. Create database user
5. Get connection string
6. Set `MONGODB_URI` in backend env vars

### Option B: Heroku (Both Frontend + Backend)

```bash
heroku login
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Deployment Checklist:
- [ ] MongoDB Atlas URI configured
- [ ] Environment variables set (.env)
- [ ] CORS configured for deployed domains
- [ ] JWT secret set securely
- [ ] Test all API endpoints after deployment
- [ ] Verify authentication works
- [ ] Check responsive design on deployed site

---

## 6. CI/CD PIPELINE

### GitHub Actions Workflow

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy on Push

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
      - run: npm run deploy  # or manual deployment
```

### Manual CI/CD Demo:
1. Create feature branch: `git checkout -b feature/add-notifications`
2. Make code change (e.g., add new feature/button)
3. Commit: `git add . && git commit -m "Add notifications feature"`
4. Push: `git push origin feature/add-notifications`
5. Create Pull Request on GitHub
6. Merge to main
7. Refresh deployed URL to see changes live

### Screenshots to Capture:
- Before update: deployed app screenshot
- GitHub branch and PR merge
- After update: deployed app with new feature
- Console showing CI/CD pipeline running (if available)

---

## 7. FINAL EXTERNAL DESIGN DOCUMENT (EDD)

### Update `EXTERNAL_DESIGN_DOCUMENT_v2.md` with:

#### Section 1: Team Information
- Team Name: Team Raw
- Team Logo: 🎓 Raw
- Team Members with photos (placeholders if needed)
- Student IDs
- Roles

#### Section 2: Wireframes
Create wireframes for:
- Landing Page
- Login/Register
- Dashboard
- Browse Books
- My Books
- Add Book
- Manage Users
- User Profile

*Use Figma, Balsamiq, or simple sketches*

#### Section 3: Screenshots
- Landing page
- Browse books with search/filter
- User authenticated dashboard
- Admin managing users
- Mobile responsive view
- Error states

#### Section 4: Color Swatches
```
Primary: #2563eb (Blue)
Secondary: #1e40af (Dark Blue)
Success: #10b981 (Green)
Danger: #ef4444 (Red)
Warning: #f59e0b (Orange)
Light BG: #f3f4f6
Dark BG: #1f2937
```

#### Section 5: Authentication & Navigation Flow Diagrams

#### Section 6: Database Schema Diagrams

---

## 8. AGILE PROJECT MANAGEMENT (Trello/Jira)

### Trello Board Setup

**Lists:**
1. **Product Backlog**
   - User Authentication
   - Book Management
   - Borrowing System
   - User Management
   - Deployment
   - Testing
   - Documentation

2. **Current Sprint (Part 4)**
   - Unit Testing
   - E2E Testing
   - Performance Optimization
   - Cloud Deployment
   - CI/CD Setup
   - Final EDD
   - Submission

3. **In Progress**
   - [Cards being worked on]

4. **Done**
   - ✓ Part 1 - Backend Setup
   - ✓ Part 2 - Frontend Integration
   - ✓ Part 3 - CRUD Operations
   - ✓ Unit Testing
   - ✓ Deployment

**Card Example:**
```
Title: Deploy to MongoDB Atlas
Description: Set up MongoDB Atlas cluster and update connection strings
Assigned: @TeamRaw
Priority: High
Sprint: Part 4
Status: In Progress
```

### Commit Guidelines (ensure all members commit):
```bash
git config user.name "Member Name"
git add <specific files>
git commit -m "Feature: Add notifications system - #task-id"
git push origin feature-branch
```

---

## 9. SUBMISSION CHECKLIST

### Deliverables:
- [ ] **Deployed App URL**: https://your-deployed-app.com
- [ ] **GitHub Repository**: https://github.com/adityashoor/Project-Part3.git
- [ ] **Unit Test Screenshots**: test-results.png, coverage.png
- [ ] **E2E Test Results**: cypress-videos/*, cypress-screenshots/*
- [ ] **Cypress Test Code**: cypress/e2e/*.cy.js files in repo
- [ ] **Performance Report**: Lighthouse score screenshot
- [ ] **Pre-Update Screenshot**: app-before-update.png
- [ ] **Post-Update Screenshot**: app-after-update.png
- [ ] **CI/CD Pipeline Evidence**: GitHub Actions workflow + merge PR screenshot
- [ ] **Final EDD PDF**: EXTERNAL_DESIGN_DOCUMENT_v2.pdf with wireframes
- [ ] **Trello/Jira Board**: Product Backlog + Task Board screenshots
- [ ] **Test this deployed link**: Verify all features work post-deployment

### Video Demo (5-10 minutes):
1. Show deployed app running
2. Walk through all features (auth, browse, add, manage)
3. Show E2E tests running
4. Explain CI/CD pipeline
5. Discuss performance optimizations
6. Review final EDD

---

## Quick Start Commands

```bash
# Backend Testing
cd backend
npm install --save-dev jest supertest
npm test

# E2E Testing
npm install --save-dev cypress
npx cypress run

# Deployment (example with Vercel)
npm install -g vercel
vercel --prod

# Create branch for CI/CD demo
git checkout -b feature/final-polish
git add .
git commit -m "Final polish for Part 4 release"
git push origin feature/final-polish
# Then create PR and merge on GitHub
```

---

**Team Raw - LibraryHub Final Release**  
*Ready for deployment and demonstration*
