import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BACKEND_URL } from '../../../config';
import Navbar from '../../components/Navbar';
import Topbar from '../../components/Topbar';

const DetailedIdea = () => {
  const { idea_id } = useParams();
  const [idea, setIdea] = useState<any>({});
  const [evaluators, setEvaluators] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [assignedEvaluators, setAssignedEvaluators] = useState(0);
  const [selectedEvaluators, setSelectedEvaluators] = useState<any[]>([]);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch idea details
  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getidea.php?idea_id=${idea_id}`, { withCredentials: true });
        setIdea(response.data.idea);
        setAssignedEvaluators(response.data.idea.assigned_count);
      } catch (error) {
        console.error('Error fetching idea:', error);
      }
    };

    const fetchEvaluators = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getevaluators.php`, { withCredentials: true });
        setEvaluators(response.data.evaluators);
      } catch (error) {
        console.error('Error fetching evaluators:', error);
      }
    };

    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getmappeddata.php?idea_id=${idea_id}`, { withCredentials: true });
        setDetails(response.data.data);
      } catch (error) {
        console.error('Error fetching evaluator details:', error);
      }
    };

    fetchIdea();
    fetchEvaluators();
    fetchDetails();
  }, [idea_id]);

  // Handle the selection of evaluator
  const handleEvaluatorChange = (evaluatorId: string) => {
    if (evaluatorId && !selectedEvaluators.includes(evaluatorId)) {
      setSelectedEvaluators((prev) => [...prev, evaluatorId]);
    }
  };

  // Remove evaluator from the list
  const handleRemoveEvaluator = (evaluatorId: string) => {
    setSelectedEvaluators((prev) => prev.filter((id) => id !== evaluatorId));
  };

  // Assign evaluators after clicking 'Assign' button
  const assignEvaluators = async () => {
    // Check for duplicate evaluators in the idea_evaluators table
    try {
      const response = await axios.get(
        `${BACKEND_URL}/check_duplicate_evaluators.php?idea_id=${idea_id}&evaluator_ids=${selectedEvaluators.join(",")}`,
        { withCredentials: true }
      );

      if (response.data.isDuplicate) {
        setErrorMessage("One or more selected evaluators are already assigned to this idea.");
      } else {
        // Proceed with assigning evaluators if no duplicates
        await axios.post(
          `${BACKEND_URL}/map_evaluator_idea.php`,
          { evaluator_ids: selectedEvaluators, idea_id },
          { withCredentials: true }
        );
        setSelectedEvaluators([]);
        setErrorMessage("");  // Reset error message
        alert('Evaluators assigned successfully!');
      }
    } catch (error) {
      console.error('Error assigning evaluators:', error);
      alert('Failed to assign evaluators');
    }
  };

  // Function to show the dialog
  const handleVerifyClick = (evaluatorId: string) => {
    setSelectedEvaluator(evaluatorId);
    setShowVerifyDialog(true);
  };

  // Function to handle confirmation
  const handleVerifyConfirm = async () => {
    try {
      // Logic to remove the evaluator
      await axios.post(
        `${BACKEND_URL}/remove_evaluator_idea.php`,
        { evaluator_id: selectedEvaluator, idea_id },
        { withCredentials: true }
      );

      // After removing evaluator, hide dialog and refresh evaluator list
      setShowVerifyDialog(false);
      alert('Evaluator removed successfully!');
      // You might want to refetch the evaluators or update the state to reflect the changes
    } catch (error) {
      console.error('Error removing evaluator:', error);
      alert('Failed to remove evaluator');
    }
  };

  return (
    <div>
      <Navbar />
      <Topbar />
      <div className="flex items-center space-x-4">
        <Link to="/admin_ideaevaluator">
          <button className="bg-cyan-900 text-white py-2 px-4 rounded-md hover:bg-cyan-800">Back</button>
        </Link>
        <div className="text-4xl mt-4 font-semibold text-gray-800">Detail View of Idea</div>
      </div>

      <div className="mt-6">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Idea Details */}
          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-600"><strong>Title:</strong></p>
            <p className="text-gray-800">{idea.idea_title}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-600"><strong>Description:</strong></p>
            <p className="text-gray-800">{idea.idea_description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-600"><strong>Student Name:</strong></p>
            <p className="text-gray-800">{idea.student_name}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-600"><strong>School:</strong></p>
            <p className="text-gray-800">{idea.school}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-600"><strong>Type:</strong></p>
            <p className="text-md text-gray-800">{idea.type}</p>
          </div>

          {idea.assigned_count < 3 && idea.assigned_count > 1 && (
            <div className="space-y-2">
              <p className="text-xl font-medium text-gray-600"><strong>Add Evaluator:</strong></p>
              <div className="flex items-center space-x-2">
                <select
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  value={selectedEvaluator || ''}
                  onChange={(e) => handleEvaluatorChange(e.target.value)}
                >
                  <option value="">Select Evaluator</option>
                  {evaluators
                    .filter((evaluator) => !details.some((assigned) => assigned.evaluator_id === evaluator.id))
                    .map((evaluator) => (
                      <option key={evaluator.id} value={evaluator.id}>
                        {`${evaluator.first_name} ${evaluator.last_name}`}
                      </option>
                    ))}
                </select>

                {/* Assign Evaluators Button */}
                <button
                  onClick={assignEvaluators}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Assign Evaluators
                </button>
              </div>

              {/* Display selected evaluators as tags */}
              {selectedEvaluators.length > 0 && (
                <div className="mt-4 ">
                  <div className="flex flex-wrap gap-2">
                    {selectedEvaluators.map((evaluatorId) => {
                      const evaluator = evaluators.find((e) => e.id === evaluatorId);
                      return (
                        evaluator && (
                          <div key={evaluatorId} className="flex items-center bg-blue-200 text-gray-800 px-3 py-1 rounded-full">
                            <span>{`${evaluator.first_name} ${evaluator.last_name}`}</span>
                            <button
                              onClick={() => handleRemoveEvaluator(evaluatorId)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              X
                            </button>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xl font-medium text-gray-600"><strong>Status ID:</strong></p>
            <p className="text-md text-gray-800">
              {idea.status_id === 3 ? (
                <span className="text-gray-500">Not Assigned</span>
              ) : idea.status_id === 2 ? (
                <span className="text-yellow-500">Not Evaluated</span>
              ) : idea.status_id === 1 ? (
                <span className="text-green-500">Recommended</span>
              ) :
                idea.status_id === 0 ? (
                  <span className="text-red-500">Not Recommended</span>
                ) : (
                  <span className="text-red-400">Unknown status</span>)}
            </p>
          </div>
           {/* Evaluators and Assign Button */}
       <div className="mt-6">
       {/* Display Error Message */}
       {errorMessage && (
         <div className="bg-red-100 text-red-700 py-2 px-4 rounded-md mb-4">
           {errorMessage}
         </div>
       )}
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
