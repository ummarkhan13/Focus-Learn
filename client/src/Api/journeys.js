import Cookies from 'js-cookie';
import { apiurl } from '.';


export const getAuthToken = () => {
    const token =  Cookies.get('authToken');
    console.log(token);
    return token
};

export const createJourney = async (journeyData) => {
  const token = getAuthToken();
  
  
  try {
    const response = await fetch(`${apiurl}/journeys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(journeyData),
    });

    if (!response.ok) {
      throw new Error('Failed to create journey');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating journey:', error.message);
  }
};

//create with playlist
export const createJourneyWithPlaylist = async (journeyData) => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${apiurl}/journeys/playlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(journeyData),
    });

    if (!response.ok) {
      throw new Error('Failed to create journey');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating journey:', error.message);
  }
};

export const getAllJourneys = async () => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${apiurl}/journeys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch journeys: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    // setData(data);
    return data;
  } catch (error) {
    console.error('Error fetching journeys:', error.message);
  }
};

// Get a specific journey by ID
export const getJourneyById = async (journeyId) => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${apiurl}/journeys/${journeyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journey');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching journey by ID:', error.message);
  }
};

// Update a journey by ID
export const updateJourney = async (journeyId, updatedJourneyData) => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}/journeys/${journeyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedJourneyData),
    });

    if (!response.ok) {
      throw new Error('Failed to update journey');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating journey:', error.message);
  }
};


export const deleteJourney = async (journeyId) => {
  const token = getAuthToken();
  
  try {
    const response = await fetch(`${apiurl}/journeys/${journeyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete journey');
    }

    return { message: 'Journey deleted successfully' };
  } catch (error) {
    console.error('Error deleting journey:', error.message);
  }
};

export const fetchPublicJourneys = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${apiurl}/journeys/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch public journeys');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching public journeys:', error);
    throw error;
  }
};


export const forkJourney = async (journeyId) => {
  const token = getAuthToken();
  const response = await fetch(`${apiurl}/journeys/${journeyId}/fork`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fork the journey');
  }

  const data = await response.json();
  return data;
};