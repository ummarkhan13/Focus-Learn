import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import JourneyPage from "./Pages/JourneyPage";
import ProfileDashboard from "./Pages/ProfileDashboard";
import VideoPlayerPage from "./Pages/VideoPlayerPage";
import Cookies from "js-cookie";
import Auth from "./Pages/Auth";
import Notes from "./Pages/Notes";

function getPayload(jwt) {
  return JSON.parse(atob(jwt.split(".")[1]));
}


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      const payload = getPayload(token);
      const expiration = new Date(payload.exp * 1000); 
      const now = new Date();

      if (expiration < now) {
        Cookies.remove("authToken"); 
        navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/journey/:jId" element={<JourneyPage />} />
        <Route path="/notes/:journeyId" element={<Notes />} />
        <Route path="/player/:chapterId" element={<VideoPlayerPage />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
