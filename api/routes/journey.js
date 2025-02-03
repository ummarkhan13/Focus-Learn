// routes/journey.js

const express = require("express");
const authenticateToken = require("../controllers/auth");
const router = express.Router();
const {
    createJourney,
    getAllJourneys,
    getJourneyById,
    updateJourney,
    deleteJourney,
    forkJourney,
    createJourneyFromPlaylist,
    getPublicJourneys

} = require('../controllers/journeys');



router.get('/journeys/public', getPublicJourneys);

router.post('/journeys', authenticateToken,createJourney);
router.post('/journeys/playlist', authenticateToken, createJourneyFromPlaylist);
router.get('/journeys', authenticateToken, getAllJourneys);
router.get('/journeys/:id', authenticateToken, getJourneyById);
router.put('/journeys/:id', authenticateToken, updateJourney);
router.delete('/journeys/:id', authenticateToken, deleteJourney);
router.post('/journeys/:id/fork', authenticateToken, forkJourney);


module.exports = router;