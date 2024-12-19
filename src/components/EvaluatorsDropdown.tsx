import { useState } from 'react';

type EvaluatorOption = {
  id: string;
  name: string;
  selected: boolean;
};

type IdeaevaluatorProps = {
  evaluators: { id: string; first_name: string }[];
  formData: { selectedEvaluators: string[] };
  setFormData: React.Dispatch<React.SetStateAction<{ selectedEvaluators: string[] }>>;
};

const Ideaevaluator: React.FC<IdeaevaluatorProps> = ({ evaluators, formData, setFormData }) => {
  const [options, setOptions] = useState<EvaluatorOption[]>(evaluators.map(evaluator => ({
    id: evaluator.id,
    name: evaluator.first_name,
    selected: false,
  })));

  const handleSelect = (index: number) => {
    const updatedOptions = [...options];
    const option = updatedOptions[index];
    option.selected = !option.selected;
    setOptions(updatedOptions);

    if (option.selected) {
      setFormData(prevData => ({
        ...prevData,
        selectedEvaluators: [...prevData.selectedEvaluators, option.id],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        selectedEvaluators: prevData.selectedEvaluators.filter(id => id !== option.id),
      }));
    }
  };

  const handleSubmit = () => {
    if (formData.selectedEvaluators.length !== 3) {
      alert('Please select exactly 3 evaluators');
      return;
    }
    // Submit the selected evaluators
    console.log('Selected Evaluators:', formData.selectedEvaluators);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl mb-4">Assign Evaluators</h2>
      <div className="flex flex-wrap space-x-2">
        {formData.selectedEvaluators.map((evaluatorId) => {
          const evaluator = evaluators.find(e => e.id === evaluatorId);
          return evaluator ? (
            <div
              key={evaluator.id}
              className="flex items-center p-2 bg-blue-500 text-white rounded-full"
            >
              {evaluator.first_name}
            </div>
          ) : null;
        })}
      </div>
      <div className="w-full bg-white rounded shadow-md p-4 mt-4">
        <div className="flex flex-col space-y-2">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`cursor-pointer p-2 border rounded ${
                option.selected ? 'bg-blue-200' : 'bg-gray-200'
              }`}
              onClick={() => handleSelect(index)}
            >
              {option.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          onClick={() => setFormData({ selectedEvaluators: [] })}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Ideaevaluator;
