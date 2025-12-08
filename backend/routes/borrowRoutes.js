const express = require('express');
const { borrowBook, returnBook, getAllBorrowRecords, getUserBorrowRecords, getBorrowRecordById } = require('../controllers/borrowController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Private routes
router.post('/', protect, borrowBook);
router.put('/:id/return', protect, returnBook);
router.get('/user/:userId', protect, getUserBorrowRecords);
router.get('/:id', protect, getBorrowRecordById);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBorrowRecords);

module.exports = router;
