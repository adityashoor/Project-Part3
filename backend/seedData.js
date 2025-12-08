// Sample Seed Data for Library Management System
// Save as: backend/seedData.js
// Run with: node seedData.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Book = require('./models/Book');
const BorrowRecord = require('./models/BorrowRecord');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await BorrowRecord.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        password: 'password123',
        phone: '555-0101',
        role: 'user',
        memberId: 'LM001'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'librarian@example.com',
        password: 'password123',
        phone: '555-0102',
        role: 'librarian',
        memberId: 'LM002'
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123',
        phone: '555-0103',
        role: 'admin',
        memberId: 'LM003'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        phone: '555-0104',
        role: 'user',
        memberId: 'LM004'
      }
    ]);
    console.log('Created 4 sample users');

    // Create sample books
    const books = await Book.create([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0743273565',
        publisher: 'Scribner',
        publicationDate: new Date('1925-04-10'),
        category: 'Fiction',
        description: 'A classic American novel set in the Jazz Age',
        totalCopies: 5,
        availableCopies: 3,
        language: 'English',
        pages: 180,
        addedBy: users[1]._id
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0061120084',
        publisher: 'J. B. Lippincott',
        publicationDate: new Date('1960-07-11'),
        category: 'Fiction',
        description: 'A gripping tale of racial injustice and childhood innocence',
        totalCopies: 4,
        availableCopies: 2,
        language: 'English',
        pages: 281,
        addedBy: users[1]._id
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        publisher: 'Signet',
        publicationDate: new Date('1949-06-08'),
        category: 'Fiction',
        description: 'A dystopian novel set in a totalitarian state',
        totalCopies: 3,
        availableCopies: 1,
        language: 'English',
        pages: 328,
        addedBy: users[1]._id
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0553380163',
        publisher: 'Bantam',
        publicationDate: new Date('1988-04-01'),
        category: 'Science',
        description: 'Explores the universe from the Big Bang to black holes',
        totalCopies: 2,
        availableCopies: 2,
        language: 'English',
        pages: 256,
        addedBy: users[1]._id
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '978-0062316097',
        publisher: 'Harper',
        publicationDate: new Date('2014-09-04'),
        category: 'Non-Fiction',
        description: 'A sweeping history of humankind from the Stone Age to present day',
        totalCopies: 4,
        availableCopies: 3,
        language: 'English',
        pages: 656,
        addedBy: users[1]._id
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J. D. Salinger',
        isbn: '978-0316769174',
        publisher: 'Little, Brown',
        publicationDate: new Date('1951-07-16'),
        category: 'Fiction',
        description: 'A teenager\'s perspective on life in New York City',
        totalCopies: 3,
        availableCopies: 0,
        language: 'English',
        pages: 277,
        addedBy: users[1]._id
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        publisher: 'Prentice Hall',
        publicationDate: new Date('2008-08-01'),
        category: 'Technology',
        description: 'A handbook of agile software craftsmanship',
        totalCopies: 5,
        availableCopies: 4,
        language: 'English',
        pages: 464,
        addedBy: users[1]._id
      },
      {
        title: 'The Art of Computer Programming',
        author: 'Donald E. Knuth',
        isbn: '978-0201616224',
        publisher: 'Addison-Wesley',
        publicationDate: new Date('1968-01-01'),
        category: 'Technology',
        description: 'Fundamental algorithms and analysis of algorithms',
        totalCopies: 2,
        availableCopies: 2,
        language: 'English',
        pages: 672,
        addedBy: users[1]._id
      }
    ]);
    console.log('Created 8 sample books');

    // Create sample borrow records
    const borrowRecords = await BorrowRecord.create([
      {
        userId: users[0]._id,
        bookId: books[0]._id,
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'active'
      },
      {
        userId: users[0]._id,
        bookId: books[2]._id,
        borrowDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        returnDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        status: 'returned'
      },
      {
        userId: users[3]._id,
        bookId: books[1]._id,
        borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        status: 'active'
      }
    ]);
    console.log('Created sample borrow records');

    // Update book availability based on borrow records
    books[0].availableCopies = books[0].totalCopies - 2;
    books[1].availableCopies = books[1].totalCopies - 1;
    books[2].availableCopies = books[2].totalCopies - 1;
    await Promise.all(books.map(book => book.save()));
    console.log('Updated book availability');

    console.log('\n=== DATABASE SEEDING COMPLETE ===\n');
    console.log('Sample Users:');
    console.log('  User: user@example.com / password123');
    console.log('  Librarian: librarian@example.com / password123');
    console.log('  Admin: admin@example.com / password123');
    console.log('\nSample Books: 8 books added');
    console.log('Sample Borrow Records: 3 records created');
    console.log('\nYou can now login and test the application!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
