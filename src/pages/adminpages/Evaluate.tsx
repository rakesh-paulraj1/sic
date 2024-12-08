import React, { useEffect, useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from '../../components/Navbar';
import EvaluatorTopbar from "../../components/EvaluatorTopbar";
import { BACKEND_URL } from '../../../config';
import { useParams } from "react-router-dom";
import IdeaDetails from "../../components/Ideadetails";
import { ScoreRow } from "../../components/Boxes";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
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
  const [usefullness, Setusefullness] = useState(0);
  const [feasability, Setfeasability] = useState(0);
  const [scalability, Setscalability] = useState(0);
  const [sustaiblity, Setsustaiblity] = useState(0);
  const [comment, setComment] = useState('');
  const [idea, setIdea] = useState<Idea>();
  const { idea_id } = useParams();

  const navigate = useNavigate(); 
  const handleCommentChange = (e) => {
    setComment(e.target.value);
};

  useEffect(() => {
    const role=localStorage.getItem("role");
    if(role!="evaluator"){
      navigate("/");
    }
   
    axios.get(`${BACKEND_URL}getidea.php?idea_id=${idea_id}`, {
        withCredentials: true,
      })
      .then((response) => {
      

        setIdea(response.data.idea);
       
      })
      .catch(() => {
        console.log("Failed to fetch ideas");
      });
  }, [navigate]);
  const handlesubmit=()=>{
    const score = noveltyScore + usefullness + feasability + scalability + sustaiblity;
   
    
    axios.post(`${BACKEND_URL}evaluate.php`,{ evaluator_id: localStorage.getItem("user_id"),
      idea_id: idea_id,
      novelty_score: noveltyScore,
      usefulness_score: usefullness,
      feasability_score: feasability,
      scalability_score: scalability,
      sustainability_score: sustaiblity,
      comment: comment,
      score: score,}, {
      withCredentials: true,
    })
      .then((response) => {
        console.log(response);
        navigate("/evaluatordashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="w-full max-w-full">
      <Navbar />
    <EvaluatorTopbar />
    <Link to="/admindashboard"> 
          <button className="bg-cyan-900 mt-4 ml-3 text-white py-2 px-4 rounded-md hover:bg-cyan-800">Back</button>
        </Link>
   <div className="flex flex-col">
    {idea && <IdeaDetails idea={idea} />}
    <div className="  flex flex-col mt-10">
    <p className="text-4xl font-medium text-black-600"><strong>Evaluate the Idea</strong></p>
    <ScoreRow
        category="Novelty Score"
        score={noveltyScore}
        onScoreChange={setNoveltyScore} 
      />
      <ScoreRow
        category="Usefullness Score"
        score={usefullness}
        onScoreChange={Setusefullness} 
      />
      <ScoreRow
        category="Feasability Score"
        score={feasability}
        onScoreChange={Setfeasability} 
      />
      <ScoreRow
        category="Scalability Score"
        score={scalability}
        onScoreChange={Setscalability} 
      />
      <ScoreRow
        category="Sustainability Score"
        score={sustaiblity}
        onScoreChange={Setsustaiblity} 
      />
      
      </div>
      
    </div>
    <div className="w-full mt-4 max-w-xl mx-auto">
    <span className="text-xl font-medium">Comments:</span>
            <textarea 
                className="
                    w-full 
                    h-64 
                    p-4 
                    border-2 
                    border-gray-300 
                    rounded-lg 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:border-transparent 
                    text-lg 
                    resize-y 
                    hover:border-blue-300 
                    transition-all 
                    duration-300 
                    shadow-sm 
                    placeholder-gray-400
                "
                placeholder="Share your thoughts or ideas here..."
                value={comment}
                onChange={handleCommentChange}
            />
            
            <div className="text-right text-sm text-gray-500 mt-2">
                {comment.length} / 500 characters
            </div>
       <Button onClick={()=> {
        handlesubmit();
       }} content="Submit"  />
        </div>
  </div>
  
  );
}