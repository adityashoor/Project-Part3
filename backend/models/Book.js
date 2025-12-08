const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide author name'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please provide ISBN'],
    unique: true
  },
  publisher: {
    type: String,
    required: true
  },
  publicationDate: {
    type: Date
  },
  category: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    default: ''
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'English'
  },
  pages: {
    type: Number
  },
  coverImage: {
    type: String,
    default: null
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);
