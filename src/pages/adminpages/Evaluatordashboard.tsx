import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from '../../components/Navbar';
import Topbar from '../../components/Topbar';
import UserCircleIcon from "@heroicons/react/16/solid/UserCircleIcon";
import { BACKEND_URL } from '../../../config';

interface Idea {
  idea_id: number;
  student_name: string;
  school: string;
  idea_title: string;
  status_id: number;
  theme_id: number;
  type: string;
  idea_description: string;
  assigned_count: number;
}

export function EvaluatorDashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    const authToken = Cookies.get("auth_token1");
    const evaluatorId = localStorage.getItem("evaluator_id");

    // Check if both auth_token1 and evaluator_id exist in localStorage
    if (!authToken || !evaluatorId) {
      setError("You are not authenticated or evaluator ID is missing.");
      setLoading(false);
      navigate("/"); // Redirect to login if either is missing
      return;
    }

    // If both exist, fetch assigned ideas
    axios
      .get(`http://localhost/webdev/get_assigned_ideas.php?evaluator_id=${evaluatorId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        // Ensure response data is an array and handle gracefully
        const data = Array.isArray(response.data) ? response.data : [];
        setIdeas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch ideas");
        setLoading(false);
      });
  }, [navigate]);

  const handleProfileClick = () => {
    console.log("Navigating to /profileevaluator");
    navigate("/profileevaluator"); // Navigate to the Profile page using navigate()
  };

  const handleLogout = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL}/logout.php`, {}, {
            withCredentials: true
        });

        console.log(response.data);  
        
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        Cookies.remove("auth_token1");
        Cookies.remove("role");
        localStorage.removeItem("evaluator_id");
        localStorage.removeItem("auth_token1");
        localStorage.removeItem("role");
        navigate('/'); 
    } catch (error) {
        console.error('Error during logout', error);
    }
};

  const handleEvaluateClick = (ideaId: number) => {
    // Redirect to the Score Dashboard with the selected idea ID
    navigate(`/evaluate`);
  };

  return (
    <div className="w-full max-w-full">
      {/* Navbar: Fixed at the top with higher z-index */}
      <div className="fixed top-0  left-0 w-full bg-gray-300 text-black z-20">
        <Navbar />
    
      {/* Topbar: Fixed directly below Navbar with no gap */}
      <div className="fixed top-15 left-0 w-full bg-pink-800 text-white py-4 px-6 z-10">
        <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-6">
        <Link to={"/evaluatordashboard"}><div className="text-lg font-bold">Evaluator Dashboard</div></Link>
        <Link to={"/ideaassigned"}><div className="text-lg font-bold">Idea Assigned</div></Link>
</div>
          <div className="relative">
            <button
              className="p-1 rounded-full bg-cyan-900 text-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <UserCircleIcon className="h-6 w-6" /> {/* Account icon */}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded">
                <ul>
                  <li>
                    <button
                      className="block px-4 py-2 text-black hover:bg-gray-200"
                      onClick={handleProfileClick}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="block px-4 py-2 text-black hover:bg-gray-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Add padding to content so it's not hidden behind the fixed Navbar and Topbar */}
      <div className="pt-40 w-full max-w-full"> {/* 40 to offset both Navbar and Topbar */}
        <div className="p-5 w-full max-w-full">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <table className="min-w-full border-collapse border border-gray-200 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Student Name</th>
                <th className="border border-gray-300 px-4 py-2">School</th>
                <th className="border border-gray-300 px-4 py-2">Idea Title</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Theme</th>
                <th className="border border-gray-300 px-4 py-2">Type</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Assigned Count</th>
                <th className="border border-gray-300 px-4 py-2">Evaluate</th>
              </tr>
            </thead>
            <tbody>
              {ideas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No ideas assigned
                  </td>
                </tr>
              ) : (
                ideas.map((idea) => (
                  <tr key={idea.idea_id}>
                    <td className="border border-gray-300 px-4 py-2">{idea.student_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{idea.school}</td>
                    <td className="border border-gray-300 px-4 py-2">{idea.idea_title}</td>
                    <td className="border border-gray-300 px-4 py-2">{idea.status_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{idea.theme_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{idea.type}</td>
                    <td className="border border-gray-300 px-4 py-2">{idea.idea_description}</td>
                    <td className="border border-gray-300 px-4 py-2">{idea.assigned_count}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="px-4 py-2 bg-green-400 text-white rounded"
                        onClick={() => handleEvaluateClick(idea.idea_id)}
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
