import React, { useEffect, useState } from "react";
import axios from "axios";
import {  useNavigate, useParams } from "react-router-dom"; // Import useNavigate
import Navbar from '../../components/Navbar';
import EvaluatorTopbar from "../../components/EvaluatorTopbar";
import { BACKEND_URL } from '../../../config';
import { Link } from "react-router-dom";
interface Idea {
  id: number;
  student_name: string;
  school: string;
  idea_title: string;
  status_id: number;
  theme_id: number;
  type: string;
  idea_description: string;
  assigned_count: number;
  status:string
}

export function Viewevaluated() {
  const { idea_id } = useParams();
  
  const [ideas, setIdeas] = useState<Idea[]>([]);

  

  const navigate = useNavigate(); 

  useEffect(() => {
    const role=localStorage.getItem("role");
    const evaluatorId=localStorage.getItem("user_id");
if(role!="evaluator"){
  navigate("/");
}
   console.log(evaluatorId );
   console.log(idea_id);
axios
.post(
  `${BACKEND_URL}getideascore.php`,
  {
    evaluator_id: evaluatorId,
    idea_id: idea_id,
  },
  {
    withCredentials: true,
  }
)
.then((response) => {
  console.log(response.data.data);
  const data = Array.isArray(response.data.data) ? response.data.data : [];
  setIdeas(data);
})
.catch((e:string) => {
 console.log("Error"+e);
});
}, [navigate]);

  return (
    <div className="w-full max-w-full">
  
   
     <Navbar />
     <EvaluatorTopbar/>
     
     <Link to="/evaluatordashboard"> 
          <button className="bg-cyan-900 mt-4 ml-3 text-white py-2 px-4 rounded-md hover:bg-cyan-800">Back</button>
        </Link>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6">Evaluated scores</h1>
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


         


        </div>
  <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">

    <table className="w-full table-auto border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Novelty Score</th>
          <th className="border px-4 py-2">Usefulness Score</th>
          <th className="border px-4 py-2">Feasibility Score</th>
          <th className="border px-4 py-2">Scalability Score</th>
          <th className="border px-4 py-2">Sustainability Score</th>
        </tr>
      </thead>
      <tbody>
        {ideas.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-500">
              No ideas assigned
            </td>
          </tr>
        ) : (
          ideas.map((idea) => (
            <tr key={idea.id} className="hover:bg-gray-50">
             <td> {idea.novelty_score}</td>
             <td> {idea.usefulness_score}</td>
             <td> {idea.feasibility_score}</td>
             <td> {idea.scalability_score}</td>
             <td> {idea.sustainability_score}</td>
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
