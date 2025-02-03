import React, { useEffect, useState } from 'react';
import { getNotesByJourney } from '../Api/notes'; // Import the API function
import { useParams } from 'react-router-dom';
import { getJourneyById } from '../Api/journeys';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { downloadLogo } from '../Constants';

const Notes = () => {
  const { journeyId } = useParams(); // Get the journeyId from URL params
  const [notes, setNotes] = useState([]);
  const [jData, setJData] = useState({});
  const [error, setError] = useState(null);

  // Fetch the notes when the component mounts
  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getNotesByJourney(journeyId); 
      const fetchJourney = await getJourneyById(journeyId);
      setNotes(fetchedNotes);
      setJData(fetchJourney);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes(); // Fetch notes on component mount
  }, [journeyId]); // Re-run if journeyId changes

  // Function to handle PDF generation and download
  const downloadPDF = () => {
    const input = document.getElementById('notesContent'); // Target the notes content for PDF
    
    // Temporarily change text color to black for better PDF visibility
    input.style.color = 'black';

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Create new jsPDF object (A4 size)
      const imgWidth = 210; // A4 page width
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Add the image data to PDF
      pdf.save(`${jData.title}_Notes.pdf`); // Save the PDF with the journey title

      // Revert text color back to white after PDF generation
      input.style.color = '';
    });
  };

  // Render the notes or a message if there's an error or no notes
  return (
    <div className="p-4 dark:bg-gray-900 text-white px-48">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
   
      {error && <div className="text-red-500">{error}</div>}
      {notes.length === 0 && !error ? (
        <div className='flex justify-center text-xl font-semibold items-center w-full h-[75vh]'>No notes available for {jData ? jData.title : ' this journey'}.</div>
      ) : (
        <>
          <button 
            onClick={downloadPDF}
            className="bg-primary-600 text-white font-semibold px-4 py-2 rounded mb-4 hover:bg-primary-400 flex gap-1"
          >
             <span>Download</span>   <img src={downloadLogo} className=' invert' width={'25px'} alt="" />
          </button>
          <div id="notesContent">
          <h1 className="text-2xl font-bold mb-4">Notes for {' '+jData.title}</h1>
          <ul > {/* Added id to target for PDF download */}
            {notes.map(note => (
              <li key={note.id} className="mb-2 p-2 border border-gray-300 rounded">
                {/* Display HTML content using dangerouslySetInnerHTML */}
                <div 
                  className="text-lg font-semibold"
                  dangerouslySetInnerHTML={{ __html: note.content }} 
                />
                <p className="text-gray-500 text-xs">
                  Created: {new Date(note.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          </div>

        </>
      )}
    </div>
  );
};

export default Notes;
