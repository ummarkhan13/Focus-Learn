import React, { useEffect, useState } from 'react';

import { forklogo, notesLogo } from '../Constants';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPublicJourneys, forkJourney } from '../Api/journeys';
import { getUserProfile } from '../Api';

const Explore = () => {
  const [journeys, setJourneys] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});

  const loadPublicJourneys = async () => {
    try {
      const data = await fetchPublicJourneys();
      setJourneys(data);
      console.log(journeys);
    } catch (error) {
      setError('Failed to load public journeys');
    }
  };
    const navigate = useNavigate()

  const handleFork = async (journeyId) => {
    try {
      const { newJourneyId } = await forkJourney(journeyId);
      alert('Journey forked successfully! with id ',newJourneyId); // Optionally, redirect to the new journey
        navigate('/')
    } catch (error) {
      console.error(error);
      alert('Failed to fork the journey');
    }
  };

  useEffect(() => {
    loadPublicJourneys();
    getUserProfile(setUser);
  }, []);

  return (
    <section className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
      <div className="py-10 mx-auto max-w-screen-xl">
        <p className="text-white font-bold text-4xl">Explore Community</p>
        <p className="my-4 text-white text-md">Explore a vibrant community of learners and creators! Discover shared journeys, and access valuable resources and notes. Contribute your own ideas, and take your learning to the next level.</p>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">Search Journeys</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search Journeys" required="" />
                </div>
              </form>
            </div>
          </div>
          <div className="overflow-x-auto">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-4">Journey Name</th>
                    <th scope="col" className="px-4 py-3">Owner</th>
                    <th scope="col" className="px-4 py-3">Description</th>
                    <th scope="col" className="px-4 py-3">Notes</th>
                    <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {journeys.map(journey => (
                    <tr key={journey.id} className="border-b dark:border-gray-700">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {journey.title}
                      </th>
                      <td className="px-4 py-3">{journey.username}</td>
                      <td className="px-4 py-3">
                        {journey.description.length>50 ? journey.description.substring(0,50) +'...' : journey.description  }</td>
                      <td className="px-4 py-3">
                        <Link to={`/notes/${journey.id}`}>
                          <img src={notesLogo} width="30px" className="cursor-pointer" alt="Notes" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 flex items-center justify-end">
                        { user.username === journey.username ? 
                         <Link to={'/'}
                         className="text-sm p-1 w-20   bg-gray-900 rounded-md flex justify-center items-center hover:bg-slate-600 gap-[2px] ">
                             <span>Your's 🌟</span>
                            
                         </Link>
                         :

                        <button 
                        onClick={()=>handleFork(journey.id)}
                        className="text-sm p-2   bg-gray-900 rounded-md flex justify-center items-center hover:bg-slate-600 gap-[2px] ">
                            <span>Fork</span>
                            <img src={forklogo} className=' invert' width={'15px'} alt="" />
                        </button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explore;
