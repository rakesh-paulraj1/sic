import axios from 'axios';
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useParams, Link } from 'react-router-dom';
import { BACKEND_URL } from '../../../config';
import Navbar from '../../components/Navbar';
import Topbar from '../../components/Topbar';

const DetailedIdea = () => {
  const { idea_id } = useParams();
  const [idea, setIdea] = useState({});
  const [evaluators, setEvaluators] = useState([]);
  const [details,setdetails] = useState({});
  const [assignedEvaluators, setAssignedEvaluators] = useState(0); // Correctly initialize assignedEvaluators

  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  // Fetch idea details
  const handleVerifyClick = (evaluator: any) => {
    setSelectedEvaluator(evaluator);
    setShowVerifyDialog(true);

  };
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getidea.php?idea_id=${idea_id}`, { withCredentials: true });
        setIdea(response.data.idea);
  
        setAssignedEvaluators(response.data.idea.assigned_count); // Initialize assigned count based on idea data
       // Set the already assigned evaluators
      } catch (error) {
        console.error("Error fetching idea:", error);
      }
    };
    

    // Fetch evaluators list
    const fetchEvaluators = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getevaluators.php`, { withCredentials: true });
        setEvaluators(response.data.evaluators);
   
     
    
      } catch (error) {
        console.error("Error fetching evaluators:", error);
      }
    };
    const fetchdetails=async()=>{
      try{
        const response = await axios.get(`${BACKEND_URL}/getmappeddata.php?idea_id=${idea_id}`, { withCredentials: true });
        setdetails(response.data.data);

      }catch{
        console.log("error")
      }
    }
    fetchdetails();
    fetchIdea();
    fetchEvaluators();
  }, [idea_id]);
  const handleAssignEvaluator=()=>{
    if (!selectedEvaluator) return;
    console.log(selectedEvaluator);
    console.log(idea_id);
    axios.put(`${BACKEND_URL}map_evaluator_1.php`,{
      idea_id: idea_id,
      evaluator_id: selectedEvaluator,
      withCredentials: true
    }).then((response) => {
      console.log(response.data);
      setEvaluators(evaluators.filter((evaluator) => evaluator.id !== selectedEvaluator));
      setShowVerifyDialog(false);
      window.location.reload();
     
    })
  }
  const handleVerifyConfirm = () => {
    if (!selectedEvaluator) return; // Check if an evaluator is selected
    
    axios.delete(`${BACKEND_URL}remove_evaluator_idea.php`, {
     
      data: {
        idea_id: idea_id,
        evaluator_id: selectedEvaluator,
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data);
      
      setEvaluators(evaluators.filter((evaluator) => evaluator.id !== selectedEvaluator));
      
      // Close the verify dialog
      setShowVerifyDialog(false);
      
    
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error during request:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error message:", error.message);
      }
    });
  };
  

  // const remainingEvaluators = evaluators.filter(
  //   (evaluator) => !assignedEvaluatorIds.includes(evaluator.id)
  // );

  return (
    <div>
      <Navbar />
      <Topbar />
      <div className="flex items-center space-x-4">
        <Link to="/admin_ideaevaluator">
          <button className="bg-cyan-900 text-white py-2 px-4 rounded-md hover:bg-cyan-800">
            Back
          </button>
        </Link>
        <div className="text-4xl mt-4 font-semibold text-gray-800">Detail View of Idea</div>
      </div>

      <div className="mt-6">
       

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Idea Details */}
          <div className="space-y-2">
            <p className=" text-xl font-medium text-gray-600"><strong>Title:</strong></p>
            <p className="text-gray-800">{idea.idea_title}</p>
          </div>

          <div className="space-y-2">
            <p className=" text-xl font-medium text-gray-600"><strong>Description:</strong></p>
            <p className="text-gray-800">{idea.idea_description}</p>
          </div>

          <div className="space-y-2">
            <p className=" text-xl font-medium text-gray-600"><strong>Student Name:</strong></p>
            <p className="text-gray-800">{idea.student_name}</p>
          </div>

          <div className="space-y-2">
            <p className=" text-xl font-medium text-gray-600"><strong>School:</strong></p>
            <p className="text-gray-800">{idea.school}</p>
          </div>

          <div className="space-y-2">
            <p className=" text-xl font-medium text-gray-600"><strong>Type:</strong></p>
            <p className=" text-md text-gray-800">{idea.type}</p>
          </div>
          {idea.assigned_count < 3 ? (
  <div className="space-y-2">
    <p className="text-xl font-medium text-gray-600">
      <strong>Add Evaluator:</strong>
    </p>
    <div className="flex items-center space-x-2">
      <select
        className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        value={selectedEvaluator}
        onChange={(e) => setSelectedEvaluator(e.target.value)}
      >
        <option value="">Select Evaluator</option>
        {evaluators
          .filter(
            (evaluator) =>
              !details.some((assignedEvaluator) => assignedEvaluator.evaluator_id === evaluator.id)
          ) // Filter out already assigned evaluators
          .map((evaluator) => (
            <option key={evaluator.id} value={evaluator.id}>
              {evaluator.name}
            </option>
          ))}
      </select>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={handleAssignEvaluator}
      >
        Assign
      </button>
    </div>
  </div>
) : null}

          <div className="space-y-2">
  <p className="text-xl font-medium text-gray-600"><strong>Status ID:</strong></p>
  <p className="text-md text-gray-800">
    {/* Check the status_id and display the appropriate status */}
    {idea.status_id === 3 ? (
                      <span className="text-gray-500">Not Assigned</span>
                    ) : idea.status_id === 2 ? (
                      <span className="text-yellow-500">Not Evaluated</span>
                    ) : idea.status_id === 1 ? (
                      <span className="text-green-500">Recommended</span>
                    ) : 
                    idea.status_id === 0 ? (
                      <span className="text-red-500"> Not Recommended</span>
                    ) :(
                      <span className="text-red-400">Unknows status </span>)}
  </p>
  
</div>


        </div>
       
        {/* Evaluators and Assign Button */}
        <div className="mt-6">
  {/* Check if idea status is not 3 (Not Assigned) */}
  <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">
  {idea.status_id !== 3 && (
    <div className="mt-4">
     <table className="min-w-full table-auto border border-gray-300">
  <thead>
    <tr className="bg-gray-100">
      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Evaluator Name</th>
      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Score</th>
      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Comments</th>
      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Delete Evaluator</th>
    </tr>
  </thead>
  <tbody>
    {/* Display already assigned evaluators */}
    {details && details.length > 0 ? (
      details.map((evaluator) => (
        <tr key={evaluator.evaluator_id} className="border-t">
          <td className="px-6 py-4 text-sm text-gray-800 border-r">{evaluator.evaluator_name}</td>
          <td className="px-6 py-4 text-sm text-gray-800 border-r">
            {evaluator.score !== null ? evaluator.score : 'Not Rated Yet'}
          </td>
          <td className="px-6 py-4 text-sm text-gray-800  border-r">{evaluator.evaluator_comments || 'Not Commented Yet'}</td>
          <td className="px-6 py-4 text-sm text-gray-800  border-r">{  <button
                        onClick={() =>  handleVerifyClick(evaluator.evaluator_id)}
                        className="ml-2 px-3 py-1 rounded bg-red-100 text-red-700"
                      >
                   Remove Evaluator
                      </button>}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3" className="px-6 py-4 text-sm text-gray-800 text-center border-t">
          No evaluators assigned yet.
        </td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  )}
   { idea.status_id==3 &&(
            <div className='text-3xl'>Idea Yet to assign</div>
          )}
      </div>
      {showVerifyDialog && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Are You Sure ?</h3>
            <p>Are You Sure you want to Remove this Evaluator?</p>
            <div className="mt-4 space-x-2">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={handleVerifyConfirm}
              >
                Confirm
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => setShowVerifyDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </div>
  );
};

export default DetailedIdea;
