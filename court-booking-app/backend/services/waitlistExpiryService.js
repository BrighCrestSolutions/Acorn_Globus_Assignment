const Waitlist = require('../models/Waitlist');
const { sendWaitlistExpiredEmail } = require('../utils/emailService');

/**
 * Check and update expired waitlist entries
 * Marks entries as expired if the desired time slot has passed
 * and sends notification emails to users
 */
const updateExpiredWaitlist = async () => {
  try {
    const now = new Date();
    
    // Find all waiting entries where the desired time slot has passed
    const expiredEntries = await Waitlist.find({
      status: 'waiting',
      desiredDate: { $lt: now }
    }).populate('user', 'email name')
      .populate('court', 'name');

    let updatedCount = 0;

    for (const entry of expiredEntries) {
      // Parse the desired end time to check if slot has fully passed
      const [hours, minutes] = entry.desiredEndTime.split(':').map(Number);
      const slotEndTime = new Date(entry.desiredDate);
      slotEndTime.setHours(hours, minutes, 0, 0);

      if (slotEndTime < now) {
        // Mark as expired
        entry.status = 'expired';
        await entry.save();

        // Send notification email
        try {
          await sendWaitlistExpiredEmail(
            entry.user.email,
            entry.user.name,
            {
              courtName: entry.court.name,
              date: entry.desiredDate,
              startTime: entry.desiredStartTime,
              endTime: entry.desiredEndTime
            }
          );
        } catch (emailError) {
          console.error('Failed to send expiry email:', emailError);
        }

        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(`Updated ${updatedCount} expired waitlist entries`);
    }

    return updatedCount;
  } catch (error) {
    console.error('Error updating expired waitlist:', error);
    throw error;
  }
};

/**
 * Middleware to auto-update expired waitlist entries on query
 * Runs before returning waitlist data to ensure fresh status
 */
const autoUpdateExpiredWaitlist = async (req, res, next) => {
  try {
    await updateExpiredWaitlist();
    next();
  } catch (error) {
    console.error('Auto-update expired waitlist error:', error);
    // Don't block the request, continue anyway
    next();
  }
};

module.exports = {
  updateExpiredWaitlist,
  autoUpdateExpiredWaitlist
};
