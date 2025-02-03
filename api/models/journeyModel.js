const db = require('../dbConnec');

exports.createJourney = async (data) => {
    
    const title = data.title || 'Untitled Journey'; // Use a default title if undefined
    const description = data.description || '';     // Default to an empty description if undefined
    const is_public = data.is_public !== undefined ? data.is_public : true; // Default to public if undefined
    const user_id = data.user_id || null;  

    const [result] = await db.execute(
        'INSERT INTO journeys (title, description, is_public, user_id) VALUES (?, ?, ?, ?)',
        // [data.title, data.description, data.is_public, data.user_id]
        [title, description, is_public, user_id]
    );
    return result.insertId;
};

exports.getAllJourneys = async (userId) => {
    const [rows] = await db.execute('SELECT * FROM journeys WHERE user_id = ?', [userId]);
    return rows;
};

exports.getJourneyById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM journeys WHERE id = ?', [id]);
    return rows[0];
};

exports.updateJourney = async (id, data) => {
    const [result] = await db.execute(
        'UPDATE journeys SET title = ?, description = ?, is_public = ? WHERE id = ? AND user_id = ?',
        [data.title, data.description, data.is_public, id, data.user_id]
    );
    return result.affectedRows > 0;
};

exports.deleteJourney = async (id, userId) => {
    const [result] = await db.execute('DELETE FROM journeys WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
};

// exports.forkJourney = async (data) => {
//     const [result] = await db.execute(
//         'INSERT INTO journeys (title, description, is_public, is_forked, user_id) VALUES (?, ?, ?,?, ?)',
//         [data.title, data.description, false,true, data.user_id]
//     );
//     return result.insertId;
// };

// exports.forkJourney = async (journeyId, userId) => {
//     const connection = await db.getConnection();
//     try {
//         await connection.beginTransaction();

//         // Step 1: Get the original journey details
//         const [journey] = await connection.execute(
//             'SELECT * FROM journeys WHERE id = ?',
//             [journeyId]
//         );

//         if (!journey.length) {
//             throw new Error('Journey not found');
//         }

//         // Step 2: Create a new journey for the user based on the original journey
//         const [journeyResult] = await connection.execute(
//             'INSERT INTO journeys (title, description, user_id, is_public) VALUES (?, ?, ?, ?)',
//             [journey[0].title, journey[0].description, userId, false]
//         );

//         const newJourneyId = journeyResult.insertId;

//         // Step 3: Get all chapters associated with the original journey
//         const [chapters] = await connection.execute(
//             'SELECT * FROM chapters WHERE journey_id = ?',
//             [journeyId]
//         );

//         // Mapping of old chapter IDs to new chapter IDs
//         const chapterIdMap = {};

//         if(chapters.length>1){

//             for (const chapter of chapters) {
//                 const [chapterResult] = await connection.execute(
//                     'INSERT INTO chapters (title, description, video_link, chapter_number, journey_id) VALUES (?, ?, ?, ?, ?)',
//                     [
//                         chapter.title,
//                         chapter.description,
//                         chapter.video_link,
//                         chapter.chapter_number,
//                         newJourneyId
//                     ]
//                 );
    
//                 const newChapterId = chapterResult.insertId;
//                 chapterIdMap[chapter.id] = newChapterId;
//             }
//         }

     
//         const [notes] = await connection.execute(
//             'SELECT * FROM notes WHERE journey_id = ?',
//             [journeyId]
//         );

//       if(notes.length>1){
//           for (const note of notes) {
//               const newChapterId = chapterIdMap[note.chapter_id];
  
//               if (newChapterId) {
//                   await connection.execute(
//                       'INSERT INTO notes (content, chapter_id, journey_id) VALUES (?, ?, ?, ?)',
//                       [
                        
//                           note.content,
//                           newChapterId,
//                           newJourneyId
//                       ]
//                   );
//               }
//           }

//       }

//         await connection.commit();
//         return newJourneyId;
//     } catch (error) {
//         await connection.rollback();
//         throw error;
//     } finally {
//         connection.release();
//     }
// };

exports.forkJourney = async (journeyId, userId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Step 1: Get the original journey details
        const [journey] = await connection.execute(
            'SELECT * FROM journeys WHERE id = ?',
            [journeyId]
        );

        if (!journey.length) {
            throw new Error('Journey not found');
        }

        const originalJourney = journey[0];

        // Step 2: Create a new journey for the user based on the original journey
        const [journeyResult] = await connection.execute(
            'INSERT INTO journeys (title, description, user_id, is_public) VALUES (?, ?, ?, ?)',
            [originalJourney.title || 'no-title', originalJourney.description || 'no-description', userId, false]
        );

        const newJourneyId = journeyResult.insertId;

        // Step 3: Get all chapters associated with the original journey
        const [chapters] = await connection.execute(
            'SELECT * FROM chapters WHERE journey_id = ?',
            [journeyId]
        );

        // Mapping of old chapter IDs to new chapter IDs
        const chapterIdMap = {};

        if (chapters.length > 0) {
            for (const chapter of chapters) {
                const [chapterResult] = await connection.execute(
                    'INSERT INTO chapters (title, description, video_link, chapter_no, journey_id) VALUES (?, ?, ?, ?, ?)',
                    [
                        chapter.title || 'no-title',
                        chapter.description || 'no-description',
                        chapter.video_link || '',
                        chapter.chapter_no || 0,
                        newJourneyId
                    ]
                );
    
                const newChapterId = chapterResult.insertId;
                chapterIdMap[chapter.id] = newChapterId;
            }
        }

        // Step 4: Get all notes associated with the original journey
        const [notes] = await connection.execute(
            'SELECT * FROM notes WHERE journey_id = ?',
            [journeyId]
        );

        if (notes.length > 0) {
            for (const note of notes) {
                const newChapterId = chapterIdMap[note.chapter_id];
    
                if (newChapterId) {
                    await connection.execute(
                        'INSERT INTO notes (content, chapter_id, journey_id) VALUES (?, ?, ?)',
                        [
                            note.content || 'no-notes',
                            newChapterId,
                            newJourneyId
                        ]
                    );
                }
            }
        }

        await connection.commit();
        return newJourneyId;
    } catch (error) {
        await connection.rollback();
        console.error('Error forking journey:', error);
        throw error;
    } finally {
        connection.release();
    }
};



//model
exports.getAllPublicJourneys = async () => {
    const query = `
      SELECT journeys.id, journeys.title, journeys.description, journeys.is_public, users.username
      FROM journeys
      JOIN users ON journeys.user_id = users.id
      WHERE journeys.is_public = 1
    `;
    
    try {
      const [rows] = await db.query(query);
      console.log(rows);
      return rows;
    } catch (error) {
      throw new Error('Error fetching public journeys');
    }
  };
  
