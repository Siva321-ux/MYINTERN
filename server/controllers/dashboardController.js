import Application from '../models/Application.js';

export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, applied, interview, offer, rejected] = await Promise.all([
      Application.countDocuments({ userId }),
      Application.countDocuments({ userId, stage: 'Applied' }),
      Application.countDocuments({ userId, stage: 'Interview' }),
      Application.countDocuments({ userId, stage: 'Offer' }),
      Application.countDocuments({ userId, stage: 'Rejected' })
    ]);

    res.json({
      total,
      applied,
      interview,
      offer,
      rejected
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowups = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Exclude Rejected applications from generating active warnings
    const baseQuery = {
      userId,
      stage: { $ne: 'Rejected' },
      followUpDate: { $ne: null }
    };

    const [upcoming, today, overdue] = await Promise.all([
      Application.find({
        ...baseQuery,
        followUpDate: { $gt: todayEnd }
      }).sort({ followUpDate: 1 }),

      Application.find({
        ...baseQuery,
        followUpDate: { $gte: todayStart, $lte: todayEnd }
      }).sort({ followUpDate: 1 }),

      Application.find({
        ...baseQuery,
        followUpDate: { $lt: todayStart }
      }).sort({ followUpDate: 1 })
    ]);

    res.json({
      upcoming,
      today,
      overdue
    });
  } catch (error) {
    next(error);
  }
};
