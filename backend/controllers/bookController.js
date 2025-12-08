const Book = require('../models/Book');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Librarian
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, publisher, publicationDate, category, description, totalCopies, language, pages } = req.body;

    if (!title || !author || !isbn || !totalCopies) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      publisher,
      publicationDate,
      category,
      description,
      totalCopies,
      availableCopies: totalCopies,
      language,
      pages,
      addedBy: req.userId
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate('addedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'firstName lastName email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Librarian
exports.updateBook = async (req, res, next) => {
  try {
    const { title, author, publisher, category, description, totalCopies, language, pages } = req.body;

    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.publisher = publisher || book.publisher;
    book.category = category || book.category;
    book.description = description || book.description;
    book.totalCopies = totalCopies || book.totalCopies;
    book.language = language || book.language;
    book.pages = pages || book.pages;
    book.updatedAt = Date.now();

    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Librarian
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search books
// @route   GET /api/books/search?q=
// @access  Public
exports.searchBooks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { isbn: { $regex: q, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};
