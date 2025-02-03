import React from 'react';
import YouTube from 'react-youtube'; // If you want to use react-youtube
import { extractVideoId } from '../Constants'; // Assuming you have a function to extract video ID

const YouTubeApp = ({ videoId }) => {
  // Determine embed method based on preference: iframe vs. react-youtube
  const useIframe = true; // Set this to true for iframe, false for react-youtube

  const opts = {
    height: '515',
    width: '903',
    playerVars: {
      autoplay: 1, // Enable autoplay if desired
    },
  };

  return (
    <div className='block'>
      {videoId ? (
        // useIframe ? (
        //   <iframe
        //     title="YouTube Video"
        //     width="560"
        //     height="315"
        //     src={`https://www.youtube.com/embed/${extractVideoId(videoId)}`}

        //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        //     allowFullScreen
        //   />
        // ) : (
          <YouTube videoId={extractVideoId(videoId)} opts={opts} />
          // Use react-youtube if preferred
    
        
      ) : (
        <p>No video selected</p>
      )}
    </div>
  );
};

export default YouTubeApp;