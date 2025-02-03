import { apiurl } from ".";
import { getAuthToken } from "./journeys";


const token = getAuthToken();

  export const getChaptersById = async(chapterId)=>{

    try {
        const response = await fetch(`${apiurl}/journeys/chapters/${chapterId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' 
            },
          });
        const data = await response.json();
        return data
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
};
  export const getChaptersByJourneyId = async(journeyId)=>{
    try {
        const response = await fetch(`${apiurl}/journeys/${journeyId}/chapters`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' 
            },
          });
        const data = await response.json();
        return data
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
};

export const createChapter = async(journeyId,chapterData)=>{
    if (!token) {
        alert('Authentication token is missing.');
        return;
      }
    try {
        const response = await fetch(`${apiurl}/journeys/${journeyId}/chapters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(chapterData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create chapter');
        }
  
        const data = await response.json();
        console.log('Created Chapter:', data);
        return data;
  
      } catch (error) {
        console.error('Error creating chapter:', error);
        alert('Error creating chapter');
      }
}

export const deleteChapter = async(chapterId) => {
    try {
      const response = await fetch(`${apiurl}/journeys/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete chapter');
      }
  
      console.log(`Chapter ${chapterId} deleted successfully.`);
      return true;
    } catch (error) {
      console.error('Error deleting chapter:', error);
      return false;
    }
  };

  export const updateChapterComplete = async(chapterId, chapterData) => {
    try {
      const response = await fetch(`${apiurl}/journeys/chapters/isComplete/${chapterId}`, {
        method: 'PUT',  
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(chapterData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update chapter');
      }
  
      const data = await response.json();
      console.log('Updated Chapter:', data);
      return data;
    } catch (error) {
      console.error('Error updating chapter:', error);
      alert('Error updating chapter');
    }
  };
  export const updateChapter = async(chapterId, chapterData) => {
    try {
      const response = await fetch(`${apiurl}/journeys/chapters/${chapterId}`, {
        method: 'PUT',  
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(chapterData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update chapter');
      }
  
      const data = await response.json();
      console.log('Updated Chapter:', data);
      return data;
    } catch (error) {
      console.error('Error updating chapter:', error);
      alert('Error updating chapter');
    }
  };
  
  
  