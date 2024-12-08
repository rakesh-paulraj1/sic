import React from "react";

interface IdeaDetailsProps {
  idea: {
    idea_title?: string;
    idea_description?: string;
    student_name?: string;
    school?: string;
    type?: string;
  };
}

const IdeaDetails: React.FC<IdeaDetailsProps> = ({ idea }) => {
  return (
    <div className="mt-6 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <p className="text-2xl font-medium text-black-600"><strong>Title:</strong></p>
          <p className="text-xl text-black-800">{idea?.idea_title}</p>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-medium text-black-600"><strong>Description:</strong></p>
          <p className=" text-xl text-black-800">{idea?.idea_description}</p>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-medium text-black-600"><strong>Student Name:</strong></p>
          <p className="text-xl text-black-800">{idea?.student_name}</p>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-medium text-black-600"><strong>School:</strong></p>
          <p className="text-xl text-black-800">{idea?.school}</p>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-medium text-black-600"><strong>Type:</strong></p>
          <p className=" text-xl text-md text-black-800">{idea?.type}</p>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
