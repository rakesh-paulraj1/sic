import { User2Icon } from 'lucide-react'
import axios from 'axios'
import { BACKEND_URL } from '../../config'

import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const EvaluatorTopbar = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
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
            
            localStorage.removeItem("evaluator_id");
            localStorage.removeItem("auth_token1");
            localStorage.removeItem("role");
            navigate('/'); 
        } catch (error) {
            console.error('Error during logout', error);
        }
    };
  return (
    <div className=" top-15 left-0 w-full bg-pink-800 text-white py-4 px-6 z-10">
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
         <User2Icon className="w-6 h-6" /> {/* Account icon */}
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
  )
}

export default EvaluatorTopbar