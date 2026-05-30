const Journey = require('../models/journeyModel');
const Chapter = require('../models/chapterModels');
const { getPlaylistDetails, getPlaylistVideos } = require('./playlistJourney');

// Create a new journey
exports.createJourney = async (req, res) => {
    try {
        const journeyId = await Journey.createJourney({
            title: req.body.title,
            description: req.body.description,
            is_public: req.body.is_public,
            user_id: req.user.id
        });
        res.status(201).json({ id: journeyId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//create journey by playlist
exports.createJourneyFromPlaylist = async (req, res) => {
    try {
        const { playlistId, is_public } = req.body;

        if (!playlistId) {
            return res.status(400).json({ error: 'Playlist ID is required' });
        }

        if (typeof playlistId !== 'string') {
            return res.status(400).json({ error: 'Playlist ID must be a string' });
        }

        const normalizedPlaylistId = playlistId.trim();

        if (!normalizedPlaylistId) {
            return res.status(400).json({ error: 'Playlist ID is required' });
        }

        // Fetch playlist details
        const { title, description } = await getPlaylistDetails(normalizedPlaylistId);

        // Create journey
        const journeyId = await Journey.createJourney({
            title,
            description,
            is_public: is_public !== undefined ? is_public : true,
            user_id: req.user.id
        });

        // Fetch playlist videos
        const videos = await getPlaylistVideos(normalizedPlaylistId);
        // console.log(videos);
        

        // Create chapters
        for (const video of videos) {
            await Chapter.createChapter({
                title: video.title,
                video_link: video.videoLink || 'no video',
                description: video.description,
                chapter_no: video.chapterNo,
                journey_id: journeyId
            });
        }

        res.status(201).json({ id: journeyId });
    } catch (error) {
        console.error('Error creating journey from playlist:', error.message);
        res.status(400).json({ error: error.message });
    }
};

// Get all journeys for the authenticated user
exports.getAllJourneys = async (req, res) => {
    try {
        const journeys = await Journey.getAllJourneys(req.user.id);
        res.json(journeys);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a specific journey by ID
exports.getJourneyById = async (req, res) => {
    try {
        const journey = await Journey.getJourneyById(req.params.id, req.user.id);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }
        res.json(journey);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a journey by ID
exports.updateJourney = async (req, res) => {
    try {
        const updated = await Journey.updateJourney(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            is_public: req.body.is_public,
            user_id: req.user.id
        });
        if (!updated) {
            return res.status(404).json({ message: 'Journey not found' });
        }
        res.json({ message: 'Journey updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a journey by ID
exports.deleteJourney = async (req, res) => {
    try {
        const deleted = await Journey.deleteJourney(req.params.id, req.user.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Journey not found' });
        }
        res.json({ message: 'Journey deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.forkJourney = async (req, res) => {
    try {
        //jouney id
        const jid = req.params.id;
        const userId = req.user.id;

        const newJourneyId = await Journey.forkJourney(jid, userId);

        res.status(201).json({
            message: 'Journey forked successfully',
            journeyId: newJourneyId
        });
    } catch (error) {
        if (error.message === 'Journey not found') {
            return res.status(404).json({ message: 'Journey not found' });
        }
        console.error('Error forking journey:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getPublicJourneys = async (req, res) => {
    try {
      const publicJourneys = await Journey.getAllPublicJourneys();
  
      res.status(200).json(publicJourneys || []);
    } catch (error) {
      console.error('Error fetching public journeys:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

