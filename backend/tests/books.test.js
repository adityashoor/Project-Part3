const request = require('supertest');
const mongoose = require('mongoose');

// Mock server/app
const app = require('../server');
const Book = require('../models/Book');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('Book Controller', () => {
  let authToken;
  let adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/librarytest');
    }

    // Create test users
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });

    const regularUser = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@test.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user'
    });

    // Login to get tokens
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'user123' });
    authToken = userRes.body.token;
  });

  afterAll(async () => {
    // Cleanup
    await Book.deleteMany({ isbn: /^TEST/ });
    await User.deleteMany({ email: { $in: ['admin@test.com', 'user@test.com'] } });
  });

  describe('GET /api/books', () => {
    it('should get all books without authentication', async () => {
      const res = await request(app).get('/api/books');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/books', () => {
    it('should create a book as admin', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Book',
          author: 'Test Author',
          isbn: 'TEST123456789',
          publisher: 'Test Publisher',
          category: 'Fiction',
          totalCopies: 5
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Book');
    });

    it('should fail to create book as regular user', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Unauthorized Book',
          author: 'Test Author',
          isbn: 'TEST987654321',
          publisher: 'Test Publisher',
          category: 'Fiction',
          totalCopies: 5
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'Unauthenticated Book',
          author: 'Test Author',
          isbn: 'TEST111111111',
          publisher: 'Test Publisher',
          category: 'Fiction',
          totalCopies: 5
        });

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/books/:id', () => {
    let bookId;

    beforeEach(async () => {
      // Create a test book
      const book = await Book.create({
        title: 'Update Test Book',
        author: 'Test Author',
        isbn: 'TEST555555555',
        publisher: 'Test Publisher',
        category: 'Non-Fiction',
        totalCopies: 3,
        availableCopies: 3
      });
      bookId = book._id;
    });

    it('should update book as admin', async () => {
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Title',
          category: 'Science'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
    });

    it('should fail to update book as regular user', async () => {
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Unauthorized Update'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/books/:id', () => {
    let bookId;

    beforeEach(async () => {
      const book = await Book.create({
        title: 'Delete Test Book',
        author: 'Test Author',
        isbn: 'TEST777777777',
        publisher: 'Test Publisher',
        category: 'History',
        totalCopies: 2,
        availableCopies: 2
      });
      bookId = book._id;
    });

    it('should delete book as admin', async () => {
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
