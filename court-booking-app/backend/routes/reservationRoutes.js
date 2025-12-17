const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Reservation = require('../models/Reservation');
const { checkMultiResourceAvailability } = require('../services/availabilityService');

// @route   POST /api/reservations
// @desc    Create a temporary reservation for a time slot
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { courtId, startTime, endTime } = req.body;
    const userId = req.user.id;

    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reserve a time slot that has already passed'
      });
    }

    // Check if user already has an active reservation for this slot
    const existingReservation = await Reservation.findOne({
      user: userId,
      court: courtId,
      startTime: start,
      endTime: end,
      status: 'active',
      expiresAt: { $gt: now }
    });

    if (existingReservation) {
      return res.status(200).json({
        success: true,
        reservation: existingReservation,
        message: 'Reservation already exists'
      });
    }

    // Check availability (including other reservations)
    const availabilityCheck = await checkMultiResourceAvailability(
      courtId,
      null, // No coach check for reservation
      [],   // No equipment check for reservation
      start,
      end,
      userId // Pass userId to exclude user's own reservations
    );

    if (!availabilityCheck.available) {
      return res.status(400).json({
        success: false,
        message: availabilityCheck.message
      });
    }

    // Create reservation with 5-minute expiry
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const reservation = new Reservation({
      user: userId,
      court: courtId,
      startTime: start,
      endTime: end,
      expiresAt: expiresAt,
      status: 'active'
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      reservation: reservation,
      expiresIn: 300 // seconds
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   PUT /api/reservations/:id/extend
// @desc    Extend reservation expiry time
// @access  Private
router.put('/:id/extend', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Verify ownership
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to extend this reservation'
      });
    }

    // Check if reservation is still active
    if (reservation.status !== 'active' || reservation.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reservation has expired or been cancelled'
      });
    }

    // Extend by 3 minutes from now
    reservation.expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    await reservation.save();

    res.status(200).json({
      success: true,
      reservation: reservation,
      expiresIn: 180 // seconds
    });
  } catch (error) {
    console.error('Extend reservation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel/release a reservation
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Verify ownership
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this reservation'
      });
    }

    // Mark as cancelled (will be cleaned up by TTL index)
    reservation.status = 'cancelled';
    reservation.expiresAt = new Date(); // Expire immediately
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;
