const express = require('express');
const { register, login, getMe, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/me', protect, getMe);

// Admin routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, getUserById);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
