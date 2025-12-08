const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  reservationDate: {
    type: Date,
    default: Date.now
  },
  expectedAvailableDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'ready', 'picked-up', 'cancelled'],
    default: 'pending'
  },
  position: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    default: ''
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

module.exports = mongoose.model('Reservation', reservationSchema);
