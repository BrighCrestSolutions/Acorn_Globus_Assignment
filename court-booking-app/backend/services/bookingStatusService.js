const Booking = require('../models/Booking');

/**
 * Update bookings to "completed" status after their end time has passed
 * This should be called periodically (e.g., via a cron job or scheduled task)
 */
const updateCompletedBookings = async () => {
  try {
    const now = new Date();
    
    // Find all confirmed bookings where endTime has passed
    const result = await Booking.updateMany(
      {
        status: 'confirmed',
        endTime: { $lt: now }
      },
      {
        $set: { 
          status: 'completed',
          updatedAt: now
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Updated ${result.modifiedCount} booking(s) to completed status`);
    }

    return {
      success: true,
      updatedCount: result.modifiedCount
    };
  } catch (error) {
    console.error('Error updating completed bookings:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Middleware to automatically update completed bookings on each booking query
 * This ensures bookings are marked as completed even without a cron job
 */
const autoUpdateCompletedBookings = async (req, res, next) => {
  try {
    // Run the update in the background (non-blocking)
    updateCompletedBookings().catch(err => 
      console.error('Background update failed:', err)
    );
  } catch (error) {
    // Don't block the request if update fails
    console.error('Auto-update middleware error:', error);
  }
  next();
};

module.exports = {
  updateCompletedBookings,
  autoUpdateCompletedBookings
};
