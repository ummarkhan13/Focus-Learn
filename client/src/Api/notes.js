import { apiurl } from ".";
import { getAuthToken } from "./journeys";

const token = getAuthToken();

const fetchWithToken = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};

// 1. Create a Note
export const createNote = async (journeyId, chapterId, content) => {
  try {
    const response = await fetchWithToken(`${apiurl}/journeys/${journeyId}/chapters/${chapterId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response;
  } catch (error) {
    console.error('Error creating note:', error);
  }
};

// 2. Get All Notes by Chapter
export const getNotesByChapter = async (chapterId) => {
  try {
    const response = await fetchWithToken(`${apiurl}/chapters/${chapterId}/notes`);
    return response;
  } catch (error) {
    console.error('Error fetching notes by chapter:', error);
  }
};

// 3. Get All Notes by Journey
export const getNotesByJourney = async (journeyId) => {
  try {
    const response = await fetchWithToken(`${apiurl}/journeys/${journeyId}/notes`);
    return response;
  } catch (error) {
    console.error('Error fetching notes by journey:', error);
  }
};

// 4. Get a Note by ID
export const getNoteById = async (noteId) => {
  try {
    const response = await fetchWithToken(`${apiurl}/notes/${noteId}`);
    return response;
  } catch (error) {
    console.error('Error fetching note by ID:', error);
  }
};

// 5. Update a Note
export const updateNote = async (noteId, content) => {
  try {
    const response = await fetchWithToken(`${apiurl}/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    return response;
  } catch (error) {
    console.error('Error updating note:', error);
  }
};

// 6. Delete a Note
export const deleteNote = async (noteId) => {
  try {
    const response = await fetchWithToken(`${apiurl}/notes/${noteId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};
