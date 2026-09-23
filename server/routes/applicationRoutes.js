import express from 'express';
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateStage,
  addNote,
  deleteApplication
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

router.patch('/:id/stage', updateStage);
router.post('/:id/notes', addNote);

export default router;
