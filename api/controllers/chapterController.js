const Chapter = require('../models/chapterModels');
const Journey = require('../models/journeyModel');

const assertJourneyOwned = async (journeyId, userId) => {
    const journey = await Journey.getJourneyById(journeyId, userId);
    return journey && journey.user_id === userId;
};

const getOwnedChapter = async (chapterId, userId) => {
    const chapter = await Chapter.getChapterById(chapterId);
    if (!chapter) return null;

    const journey = await Journey.getJourneyById(chapter.journey_id, userId);
    if (!journey || journey.user_id !== userId) return null;

    return chapter;
};

// Create a new chapter
exports.createChapter = async (req, res) => {
    try {
        const isOwner = await assertJourneyOwned(req.params.journeyId, req.user.id);
        if (!isOwner) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        const chapterId = await Chapter.createChapter({
            title: req.body.title,
            description: req.body.description,
            video_link: req.body.video_link,
            external_link: req.body.external_link || '',
            chapter_no: req.body.chapter_no, 
            journey_id: req.params.journeyId 
        });
        res.status(201).json({ id: chapterId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all chapters for a specific journey
exports.getChaptersByJourneyId = async (req, res) => {
    try {
        const isOwner = await assertJourneyOwned(req.params.journeyId, req.user.id);
        if (!isOwner) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        const chapters = await Chapter.getChaptersByJourneyId(req.params.journeyId);
        res.json(chapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific chapter by ID
exports.getChapterById = async (req, res) => {
    try {
        const chapter = await getOwnedChapter(req.params.id, req.user.id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json(chapter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a chapter by ID
exports.updateChapter = async (req, res) => {
    try {
        const chapter = await getOwnedChapter(req.params.id, req.user.id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const updated = await Chapter.updateChapter(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            video_link: req.body.video_link,
            external_link: req.body.external_link,
            chapter_no: req.body.chapter_no
        });
        if (!updated) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json({ message: 'Chapter updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateChapterCompleted = async (req, res) => {
    try {
        const chapter = await getOwnedChapter(req.params.id, req.user.id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const updated = await Chapter.updateChapterComplete(req.params.id, {
            is_completed: req.body.is_completed,
            
        });
        if (!updated) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json({ message: 'Chapter updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a chapter by ID
exports.deleteChapter = async (req, res) => {
    try {
        const chapter = await getOwnedChapter(req.params.id, req.user.id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const deleted = await Chapter.deleteChapter(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        res.json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
