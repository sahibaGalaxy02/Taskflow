const Notification = require('../models/Notification');

/**
 * Create a notification record.
 * @param {Object} opts
 * @param {ObjectId} opts.userId
 * @param {string}   opts.type
 * @param {string}   opts.title
 * @param {string}   opts.message
 * @param {Object}   [opts.meta]
 */
const createNotification = async ({ userId, type, title, message, meta = {} }) => {
  try {
    await Notification.create({ userId, type, title, message, meta });
  } catch (err) {
    // Notifications are non-critical — log but don't throw
    console.error('Notification creation failed:', err.message);
  }
};

module.exports = { createNotification };
