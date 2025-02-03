const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();
const YOUTUBE_API_KEY = process.env.YT_KEY;

// Fetch playlist details (title, description)
const getPlaylistDetails = async (playlistId) => {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`);

        if (!response.ok) {
            throw new Error(`Error fetching playlist details: ${response.statusText}`);
        }

        const data = await response.json();
        const playlist = data.items[0].snippet;

        console.log(playlist.title,playlist.description);

        return {
            title: playlist.title,
            description: playlist.description
        };
    } catch (error) {
        console.error('Error fetching playlist details:', error);
        throw error;
    }
};

// Fetch playlist videos
const getPlaylistVideos = async (playlistId) => {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${YOUTUBE_API_KEY}`);

        if (!response.ok) {
            throw new Error(`Error fetching playlist videos: ${response.statusText}`);
        }

        const data = await response.json();

        return data.items.map((item, index) => ({
            title: item.snippet.title,
            videoLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
            description: item.snippet.description ? item.snippet.description.substring(0, 150) : '', 
            chapterNo: index + 1
        }));
        
    } catch (error) {
        console.error('Error fetching playlist videos:', error);
        throw error;
    }
};

module.exports = {
    getPlaylistDetails,
    getPlaylistVideos
};



// const search = require('youtube-api-v3-search');
// const dotenv= require('dotenv');
// dotenv.config();
// const YOUTUBE_API_KEY = process.env.YT_KEY;

// const getPlaylistDetails = async (playlistId) => {
//     const response = await search(YOUTUBE_API_KEY, {
//         part: 'playlist',
//         id: playlistId
//     });
 

//     const playlist = response.items[0].snippet;
//     return {
//         title: playlist.title,
//         description: playlist.description
//     };
// };

// const getPlaylistVideos = async (playlistId) => {
//     const response = await search(YOUTUBE_API_KEY, {
//         part: 'playlistItem',
//         playlistId,
//         maxResults: 50
//     });

//     return response.items.map((item, index) => ({
//         title: item.snippet.title,
//         videoLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
//         description: item.snippet.description,
//         chapterNo: index + 1
//     }));
// };

// module.exports = {
//     getPlaylistDetails,
//     getPlaylistVideos
// };

// // const YoutubePlaylist = require('youtube-playlist');
// // const youtube = new YoutubePlaylist(YOUTUBE_API_KEY);

// // exports.createJourneyFromPlaylist = async (req, res) => {
// //     try {
// //         const { playlistId,is_public } = req.body;

// //         if (!playlistId) {
// //             return res.status(400).json({ error: 'Playlist ID is required' });
// //         }

// //         const playlist = await youtube.getPlaylist(playlistId);
// //         const videos = await youtube.getVideos(playlistId);

// //         const journeyId = await createJourney({
// //             title: playlist.title,
// //             description: playlist.description,
// //             is_public: is_public, 
// //             user_id: req.user.id
// //         });

// //         // Create chapters
// //         for (const [index, video] of videos.entries()) {
// //             await createChapter({
// //                 title: video.title,
// //                 description: video.description,
// //                 video_link: video.url,
// //                 is_completed: false,
// //                 chapter_no: index + 1,
// //                 journey_id: journeyId
// //             });
// //         }

// //         res.status(201).json({ id: journeyId });
// //     } catch (error) {
// //         console.error('Error creating journey from playlist:', error.message);
// //         res.status(500).json({ error: error.message });
// //     }
// // };
