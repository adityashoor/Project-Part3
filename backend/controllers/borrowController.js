const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private
exports.borrowBook = async (req, res, next) => {
  try {
    const { bookId, dueDate } = req.body;

    if (!bookId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide book ID and due date'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available'
      });
    }

    const borrowRecord = await BorrowRecord.create({
      userId: req.userId,
      bookId,
      dueDate: new Date(dueDate),
      status: 'active'
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Return a book
// @route   PUT /api/borrow/:id/return
// @access  Private
exports.returnBook = async (req, res, next) => {
  try {
    const borrowRecord = await BorrowRecord.findById(req.params.id);

    if (!borrowRecord) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    if (borrowRecord.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book already returned'
      });
    }

    borrowRecord.returnDate = Date.now();
    borrowRecord.status = 'returned';

    const book = await Book.findById(borrowRecord.bookId);
    book.availableCopies += 1;
    await book.save();

    await borrowRecord.save();

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: borrowRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all borrow records
// @route   GET /api/borrow
// @access  Private/Admin
exports.getAllBorrowRecords = async (req, res, next) => {
  try {
    const records = await BorrowRecord.find()
      .populate('userId', 'firstName lastName email')
      .populate('bookId', 'title author isbn');

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's borrow records
// @route   GET /api/borrow/user/:userId
// @access  Private
exports.getUserBorrowRecords = async (req, res, next) => {
  try {
    const records = await BorrowRecord.find({ userId: req.params.userId })
      .populate('bookId', 'title author isbn');

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get borrow record by ID
// @route   GET /api/borrow/:id
// @access  Private
exports.getBorrowRecordById = async (req, res, next) => {
  try {
    const record = await BorrowRecord.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('bookId', 'title author isbn');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};
