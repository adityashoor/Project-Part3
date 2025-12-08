const express = require('express');
const { createBook, getAllBooks, getBookById, updateBook, deleteBook, searchBooks } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

// Private/Librarian routes
router.post('/', protect, authorize('librarian', 'admin'), createBook);
router.put('/:id', protect, authorize('librarian', 'admin'), updateBook);
router.delete('/:id', protect, authorize('librarian', 'admin'), deleteBook);

module.exports = router;
