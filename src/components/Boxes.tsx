import React, { useState } from "react";

interface ScoreProps {
  category: string;
  score: number;
  maxScore?: number;
  onScoreChange: (newScore: number) => void; // Callback to handle score change
}

export function ScoreRow({ category, score, maxScore = 9, onScoreChange }: ScoreProps) {
  const [selectedScore, setSelectedScore] = useState(score);

  const handleClick = (index: number) => {
    setSelectedScore(index); // Update the local selected score
    onScoreChange(index); // Propagate the score change to the parent
  };

  const boxes = Array.from({ length: maxScore + 1 }, (_, i) => {
    let color = "bg-red-500";
    if (i >= 7) color = "bg-green-500";
    else if (i >= 4) color = "bg-yellow-500";
    else if (i >= 2) color = "bg-red-400";

    return (
        <div
        key={i}
        className={`h-10 w-10 flex items-center justify-center ${color} ${
          i === selectedScore ? "ring-2 ring-offset-2 ring-black dark:ring-white" : ""
        } cursor-pointer`}
        role="presentation"
        onClick={() => handleClick(i)} // Handle box click
      >
        <span className="text-white text-sm font-semibold">{i}</span> {/* Number inside box */}
      </div>
    );
  });

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{category}</span>
        <span className="text-sm text-muted-foreground">Score: {selectedScore}</span>
      </div>
      <div className="flex gap-0.5">{boxes}</div>
    </div>
  );
}
