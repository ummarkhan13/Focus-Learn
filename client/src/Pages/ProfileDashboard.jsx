import React, { useEffect, useState } from "react";
import OverallJourneyChart from "../Components/Dashboard/OverallJourneyChart";
import JourneyPieChart from "../Components/Dashboard/JourneyPieChart";
import { calculateProgress, logout } from "../Constants";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../Api";
import { getAllJourneys } from "../Api/journeys";
import { getChaptersByJourneyId } from "../Api/chapters";

const ProfileDashboard = () => {

  const navigate  = useNavigate();

  const handleLogout = ()=>{
      logout();
      navigate('/auth')
  }

  const [user,setUser] = useState(null);
  const [journeys, setJourneys] = useState([]);

  const fetchJourneys = async () => {
    try {

      const journeyList = await getAllJourneys();

      const journeysWithProgress = await Promise.all(
        journeyList.map(async (journey) => {

          const chapters = await getChaptersByJourneyId(journey.id);
          const progress = calculateProgress(chapters);

          return {
            name: journey.title, 
            completed: progress,
            remaining: 100 - progress,
          };
        })
      );

      setJourneys(journeysWithProgress);
    } catch (error) {
      console.error('Error fetching journeys:', error);
    }
  };

  
  useEffect(()=>{
    getUserProfile(setUser);
    fetchJourneys();
    console.log(user);
  },[])

 

   

  const overallJourneys = journeys.map((journey) => ({
    name: journey.name,
    progress: journey.completed,
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6">
        <div className="text-center text-xl font-bold mb-6">Dashboard</div>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="text-primary-200 hover:text-primary-50">
                Profile
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-primary-200 hover:text-primary-50">
                Settings
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="text-primary-200 hover:text-primary-50">
                Notifications
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Profile Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 flex justify-between px-8">
          <div className="flex  items-center">
          
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-primary-100">{user?.email}</p>
              {/* <p className="text-primary-100">San Francisco, CA</p> */}
            </div>
          </div>
         
        </section>

        {/* Journey Progress */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {journeys.map((journey, index) => (
            <JourneyPieChart
              key={index}
              data={{
                completed: journey.completed,
                remaining: journey.remaining,
              }}
              title={journey.name}
            />
          ))}
        </section>

        {/* Overall Journey Progress */}
        <section>
          <OverallJourneyChart journeys={overallJourneys} />
        </section>
      </main>
    </div>
  );
};

export default ProfileDashboard;
