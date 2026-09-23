import express from 'express';
import { getStats, getFollowups } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/followups', getFollowups);

export default router;
