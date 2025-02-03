const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const authenticateToken = require('../controllers/auth');

// Define routes for chapters
router.post('/:journeyId/chapters', authenticateToken, chapterController.createChapter);
router.get('/:journeyId/chapters', authenticateToken, chapterController.getChaptersByJourneyId);
router.get('/chapters/:id', authenticateToken, chapterController.getChapterById);
router.put('/chapters/:id', authenticateToken, chapterController.updateChapter);
router.put('/chapters/isComplete/:id', authenticateToken, chapterController.updateChapterCompleted);
router.delete('/chapters/:id', authenticateToken, chapterController.deleteChapter);

module.exports = router;