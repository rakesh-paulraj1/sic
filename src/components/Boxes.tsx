import React, { useState } from "react";

interface ScoreProps {
  category: string;
  score: number;
  maxScore?: number;
  onScoreChange: (newScore: number) => void; // Callback to handle score change
}

export function ScoreRow({ category, score, maxScore = 10, onScoreChange }: ScoreProps) {
  const [selectedScore, setSelectedScore] = useState(score);

  const handleClick = (index: number) => {
    setSelectedScore(index); 
    onScoreChange(index); 
  };

  const boxes = Array.from({ length: maxScore }, (_, i) => i + 1).map((i) => {
    let color = "bg-red-500";
    if (i >= 9) color = "bg-green-500";
    else if (i >= 7) color = "bg-yellow-500";
    else if (i >= 2) color = "bg-red-400";

    return (
        <div
        key={i}
        className={`h-20 w-32 flex items-center justify-center ${color} ${
          i === selectedScore ? "ring-2 ring-offset-2 ring-black " : ""
        } cursor-pointer`}
        role="presentation"
        onClick={() => handleClick(i)} 
      >
        <span className="text-white text-sm font-semibold">{i}</span> {/* Number inside box */}
      </div>
    );
  });

  return (
    <div className="space-y-1">
    <div className="flex items-center justify-center">
      <span className="text-xl font-medium">{category}: {selectedScore}</span>
    </div>
    <div className="flex gap-0.5 justify-center mx-auto">{boxes}</div>
  </div>
  
  );
}
