// routes/noteRoutes.js

const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticateToken = require('../controllers/auth');



router.post('/journeys/:journeyId/chapters/:chapterId/notes', authenticateToken, noteController.createNote);

router.get('/chapters/:chapterId/notes', authenticateToken, noteController.getNotesByChapter);

router.get('/journeys/:journeyId/notes', authenticateToken, noteController.getNotesByJourney);

router.get('/notes/:noteId', authenticateToken, noteController.getNoteById);

router.put('/notes/:noteId', authenticateToken, noteController.updateNote);

router.delete('/notes/:noteId', authenticateToken, noteController.deleteNote);

module.exports = router;
