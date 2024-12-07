import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Topbar from '../../components/Topbar';
import axios from 'axios';
import { BACKEND_URL } from '../../../config';
import { Link } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import Papa from 'papaparse';
import { Input } from '../../components/ui/Input';
import { LabelInputContainer } from './Login';
import { Label } from '../../components/ui/Label';
const Ideaevaluator = () => {
  const [ideas, setIdeas] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvaluators, setSelectedEvaluators] = useState([]);
  const [currentIdeaId, setCurrentIdeaId] = useState(null);
  const [evaluators, setEvaluators] = useState([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    idea_title: '',
    school: '',
    student_name: '',
    type: '',
    idea_description: '',
    status_id: '3', 
    theme_id: '',
    evaluator_id_1: '',
    evaluator_id_2: '',
    evaluator_id_3: '',
  });
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // Assuming the CSV has headers that match the form field names
          const csvData = results.data[0]; // Taking the first row for simplicity
  
          // Log the parsed CSV data for debugging
          console.log("CSV Data:", csvData);
  
          // Extract the evaluator_ids string (it should be like "[17,18,19]")
          
  
          // Log the raw evaluator_ids value to check its format
          
  
          // Parse evaluator_ids string to array of integers
         
         
          // Log the parsed evaluator_ids
         
  
          // Update the form data state
          setFormData({
            ...formData,
            student_name: csvData['student_name'] || '',
            school: csvData['school'] || '',
            idea_title: csvData['idea_title'] || '',
            status_id: csvData['status_id'] || '3',  // Default status if missing
            theme_id: csvData['theme_id'] || '',
            type: csvData['type'] || '',
            idea_description: csvData['idea_description'] || '',
            evaluator_id_1: csvData['evaluator_id_1'] || '', 
            evaluator_id_2: csvData['evaluator_id_2'] || '', 
            evaluator_id_3: csvData['evaluator_id_3'] || '', // Set evaluator_ids as an array
          });
        },
        error: function (error) {
          console.error('Error parsing CSV file:', error);
        },
      });
    }
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
   

    if (!validateForm()) {
      toast.error(errors);
    console.log(errors);
    }
    try {
      const response = await axios.post(`${BACKEND_URL}register_idea.php`, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
      toast.success(response.data.success);}
      else {
       
        toast.error(response.data.error);
      }
      window.location.reload();
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to register idea.');
    }
  };
  const validateForm = () => {
    const requiredFields = [
      'student_name',
      'school',
      'type',
      'idea_description',
      'idea_title',
      'theme_id', 
      'evaluator_id_1',
      'evaluator_id_2',
      'evaluator_id_3',
      
    ];

    const newErrors: Record<string, string> = requiredFields.reduce(
      (errors: Record<string, string>, field: string) => {
        const value = formData[field as keyof typeof formData];

        // Check if the value is empty for required fields
        if (!value && value !== 0) {
          errors[field] = `${field.replace(/_/g, ' ')} is required`;
          return errors;
        }

        // Validate 'student_name', 'school', and 'type' - should not exceed a single word (no spaces)
        if (['student_name', 'school', 'type'].includes(field)) {
          const wordCount = String(value).trim().split(/\s+/).length;
          if (wordCount > 5) {
            errors[field] = `${field.replace(/_/g, ' ')} should not exceed Five word`;
          }
        }

        // Validate 'idea_description' and 'idea_title' - should not exceed 100 characters
        if ([ 'idea_title'].includes(field)) {
          const maxLength = 50;
          if (String(value).length > maxLength) {
            errors[field] = `${field.replace(/_/g, ' ')} should not exceed ${maxLength} characters`;
          }
        }
        if (['idea_description'].includes(field)) {
          const maxLength = 300;
          if (String(value).length > maxLength) {
            errors[field] = `${field.replace(/_/g, ' ')} should not exceed ${maxLength} characters`;
          }
        }

        return errors;
      },
      {}
    );

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join('\n');
      toast.error(errorMessages);
      return false;
    }

    return true;
  };
 
  const fetchEvaluators = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}getevaluators.php`, { withCredentials: true });
      setEvaluators(response.data.evaluators);
    } catch (error) {
      console.error('Error fetching evaluators:', error);
    }
  };
  const downloadCSV = () => {
    if (evaluators.length === 0) return; // If no evaluators, don't attempt to download

    const csvData = convertToCSV(evaluators);

    // Create a Blob with the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'evaluators.csv');
    document.body.appendChild(link); // Append link to body (not visible)
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up by removing the link
  };


  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(','); // Get column headers from the keys of the first object
    const rows = data.map((item) => Object.values(item).join(',')); // Get each row's values
    return [headers, ...rows].join('\n'); // Join headers and rows with new lines
  };

  const handleOpenDialog = (ideaId) => {
    setCurrentIdeaId(ideaId);
    setIsDialogOpen(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvaluators([]);
  };

  // Handle the submit action when evaluators are selected
  const handlefileSubmit = async  () => {
   
    if (!validateForm()) {
      toast.error(errors);
   
    }
    console.log(formData);
    try {
      const response = await axios.post(`${BACKEND_URL}csv_idea_mapper.php`, formData, {
        withCredentials: true,
      });
console.log(response);
      if (response.data.success) {
      toast.success(response.data.success);}
      else {
       
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to register idea.');
    }
  };

  
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}getideas.php`, { withCredentials: true });
        setIdeas(response.data.ideas);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();
    fetchEvaluators();
  }, []);

  return (
    <div>
      <Navbar />
      <Topbar />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Admin Idea Evaluator</h1>
      </div>
      <div className="flex space-x-4 items-center mb-6">
      <button onClick={downloadCSV} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
        Download Evaluators as CSV
      </button>
   
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
      <LabelInputContainer className="mb-4">
              <Label htmlFor="csvFile">Upload CSV to Import Ideas and Map with evaluators</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="p-4 text-lg  w-full h-16 border border-gray-300 rounded-md"
              />
            </LabelInputContainer>
            <button onClick={handlefileSubmit} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
       Submit Ideas
      </button>
        <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">
          <h2 className="text-2xl font-semibold mb-4">Idea Details</h2>
          
          <table className="w-full table-auto">
  <thead>
    <tr>
      <th className="border px-4 py-2">Student Name</th>
      <th className="border px-4 py-2">Idea Title</th>
      <th className="border px-4 py-2">View</th>
      <th className="border px-4 py-2">Action</th>
      <th className="border px-4 py-2">Status</th>
    </tr>
  </thead>
  <tbody>
    {!ideas ? (
      <tr>
        <td colSpan="5" className="border px-4 py-2 text-center">
          No Ideas are present
        </td>
      </tr>
    ) : (
      ideas.map((idea, index) => (
        <tr key={index}>
          <td className="border px-4 py-2">{idea.student_name}</td>
          <td className="border px-4 py-2">{idea.idea_title}</td>
          <td className="border px-4 py-2 space-x-2">
            <Link
              to={`/detailedidea/${idea.id}`}
              className="px-3 py-1 rounded bg-blue-100 text-blue-700"
              onClick={() => console.log(idea)}
            >
              Detailed View
            </Link>
          </td>
          <td className="border px-4 py-2 space-x-2">
            {idea.assigned_count < 1 && (
              <button
                onClick={() => handleOpenDialog(idea.id)}
                className="ml-2 px-3 py-1 rounded bg-yellow-100 text-yellow-700"
              >
                Assign Evaluators
              </button>
            )}
            {idea.assigned_count === 3 && (
              <button className="ml-2 px-3 py-1 rounded bg-green-100 text-green-700">
                Idea Assigned count = 3
              </button>
            )}
            {idea.assigned_count === 2 && (
              <button className="ml-2 px-3 py-1 rounded bg-green-100 text-green-700">
                Idea Assigned count = 2
              </button>
            )}
          </td>
          <td className="border px-4 py-2">
            {/* Check the status_id and display the appropriate status */}
            {idea.status_id === 3 ? (
              <span className="text-gray-500">Not Assigned</span>
            ) : idea.status_id === 2 ? (
              <span className="text-yellow-500">Not Evaluated</span>
            ) : idea.status_id === 1 ? (
              <span className="text-green-500">Recommended</span>
            ) : idea.status_id === 0 ? (
              <span className="text-red-500">Not Recommended</span>
            ) : (
              <span className="text-red-400">Unknown status</span>
            )}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>


          {isDialogOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl mb-4">Assign Evaluators</h2>

                {/* Dropdown to select evaluators */}
                  <select
                    className="w-full border px-3 py-2 mb-4"
                    multiple
                    value={selectedEvaluators}
                    onChange={(e) => setSelectedEvaluators([...e.target.selectedOptions].map(option => option.value))}
                  >
                    <option value="">Select Evaluators (Choose 3)</option>
                    {evaluators.map((evaluator) => (
                      <option key={evaluator.id} value={evaluator.id}>
                        {evaluator.name}
                      </option>
                    ))}
                  </select>

                {/* Dialog actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCloseDialog}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Ideaevaluator;