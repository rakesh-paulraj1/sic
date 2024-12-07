import React, { useEffect, useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from '../../components/Navbar';
import EvaluatorTopbar from "../../components/EvaluatorTopbar";
import { BACKEND_URL } from '../../../config';
import { useParams } from "react-router-dom";
import IdeaDetails from "../../components/Ideadetails";
import { ScoreRow } from "../../components/Boxes";
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
}

export function Evaluate() {
  const [noveltyScore, setNoveltyScore] = useState(0);
  const [idea, setIdea] = useState<Idea>();
  const { idea_id } = useParams();

  const navigate = useNavigate(); 

  useEffect(() => {
    const role=localStorage.getItem("role");
    if(role!="evaluator"){
      navigate("/");
    }
   
    axios.get(`${BACKEND_URL}getidea.php?idea_id=${idea_id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);

        setIdea(response.data.idea);
       
      })
      .catch(() => {
        console.log("Failed to fetch ideas");
      });
  }, [navigate]);

  return (
    <div className="w-full max-w-full">
     

 
    <Navbar />
    <EvaluatorTopbar />
   <div className="flex flex-col   mt-10">
    {idea && <IdeaDetails idea={idea} />}

    <ScoreRow
        category="Novelty Score"
        score={noveltyScore}
        onScoreChange={setNoveltyScore} // Pass the setter function
      />
    </div>
  </div>
  
  );
}