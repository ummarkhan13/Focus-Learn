// controllers/noteController.js

const Note = require('../models/noteModel');
const Chapter = require('../models/chapterModels');
const Journey = require('../models/journeyModel');

// Create a new note
exports.createNote = async (req, res) => {
    try {
        const {content } = req.body;
        const { journeyId, chapterId } = req.params;

        // Validate if journey exists
        const journey = await Journey.getJourneyById(journeyId);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        // Validate if chapter exists and belongs to the journey
        const chapter = await Chapter.getChapterById(chapterId);
        if (!chapter || chapter.journey_id !== parseInt(journeyId)) {
            return res.status(404).json({ message: 'Chapter not found or does not belong to the specified journey' });
        }

        const noteId = await Note.createNote({
            content,
            chapter_id: chapterId,
            journey_id: journeyId
        });

        res.status(201).json({ message: 'Note created successfully', noteId });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all notes for a chapter
exports.getNotesByChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;

        // Validate if chapter exists
        const chapter = await Chapter.getChapterById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const notes = await Note.getNotesByChapterId(chapterId);
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all notes for a journey
exports.getNotesByJourney = async (req, res) => {
    try {
        const { journeyId } = req.params;

        // Validate if journey exists
        const journey = await Journey.getJourneyById(journeyId);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        const notes = await Note.getNotesByJourneyId(journeyId);
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
    try {
        const { noteId } = req.params;

        const note = await Note.getNoteById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a note by ID
exports.updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { content } = req.body;

        const noteExists = await Note.getNoteById(noteId);
        if (!noteExists) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const updated = await Note.updateNote(noteId, { content });
        if (!updated) {
            return res.status(400).json({ message: 'Failed to update note' });
        }

        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const noteExists = await Note.getNoteById(noteId);
        if (!noteExists) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const deleted = await Note.deleteNote(noteId);
        if (!deleted) {
            return res.status(400).json({ message: 'Failed to delete note' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
