import React, { useEffect, useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom"; // Import useNavigate
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
  const [ideas, setIdeas] = useState<Idea[]>([]);

  

  const navigate = useNavigate(); 

  useEffect(() => {
    const role=localStorage.getItem("role");
    const evaluatorId=localStorage.getItem("user_id");
if(role!="evaluator"){
  navigate("/");
}
   
    axios
      .get(`${BACKEND_URL}get_assigned_ideas.php?evaluator_id=${evaluatorId}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        const data = Array.isArray(response.data.ideas) ? response.data.ideas : [];

        setIdeas(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch ideas");
        setLoading(false);
      });
  }, [navigate]);





  const handleEvaluateClick = (ideaId: number) => {
    navigate(`/evaluate/${ideaId}`);
  };
const handleViewEvaluatedClick=(ideaId:number)=>{
  navigate(`/viewevaluated/${ideaId}`);
}
  return (
    <div className="w-full max-w-full">
  
   
     <Navbar />
     <EvaluatorTopbar/>
     
     <Link to="/admindashboard"> 
          <button className="bg-cyan-900 mt-4 ml-3 text-white py-2 px-4 rounded-md hover:bg-cyan-800">Back</button>
        </Link>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6">Evaluator Dashboard</h1>
  <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">
    <h2 className="text-2xl font-semibold mb-4">Ideas Assigned</h2>

    <table className="w-full table-auto border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Student Name</th>
          <th className="border px-4 py-2">School</th>
          <th className="border px-4 py-2">Idea Title</th>
          <th className="border px-4 py-2">Description</th>
          <th className="border px-4 py-2">Evaluate</th>
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
              
              <td className="border px-4 py-2">{idea.student_name}</td>
              <td className="border px-4 py-2">{idea.school}</td>
              <td className="border px-4 py-2">{idea.idea_title}</td>
              <td className="border px-4 py-2">{idea.idea_description}</td>
              <td className="border px-4 py-2 space-x-2">
                
                {idea.status=="not evaluated" ? (  <button
   
      className="px-3 py-1 rounded bg-blue-100 text-blue-700"
    onClick={() => handleEvaluateClick(idea.id)}
  >
    Evaluate
  </button>):( <button
    className="px-3 py-1 rounded bg-green-100 text-green-700"
    onClick={() =>  handleViewEvaluatedClick(idea.id) }
  >
    View Evaluated
  </button>)}
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
