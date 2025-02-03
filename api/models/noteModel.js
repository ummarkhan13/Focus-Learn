// models/noteModel.js

const db = require('../dbConnec');

// Create a new note
exports.createNote = async (data) => {
    const [result] = await db.execute(
        `INSERT INTO notes ( content, chapter_id, journey_id)
         VALUES ( ?, ?, ?)`,
        [ data.content, data.chapter_id, data.journey_id]
    );
    return result.insertId;
};

// Get all notes for a specific chapter
exports.getNotesByChapterId = async (chapterId) => {
    const [rows] = await db.execute(
        `SELECT * FROM notes WHERE chapter_id = ? ORDER BY created_at ASC`,
        [chapterId]
    );
    return rows;
};

// Get all notes for a specific journey
exports.getNotesByJourneyId = async (journeyId) => {
    const [rows] = await db.execute(
        `SELECT * FROM notes WHERE journey_id = ? ORDER BY chapter_id ASC, created_at ASC`,
        [journeyId]
    );
    return rows;
};

// Get a single note by ID
exports.getNoteById = async (id) => {
    const [rows] = await db.execute(
        `SELECT * FROM notes WHERE id = ?`,
        [id]
    );
    return rows[0];
};

// Update a note by ID
exports.updateNote = async (id, data) => {
    const [result] = await db.execute(
        `UPDATE notes SET  content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [ data.content, id]
    );
    return result.affectedRows > 0;
};

// Delete a note by ID
exports.deleteNote = async (id) => {
    const [result] = await db.execute(
        `DELETE FROM notes WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
};
