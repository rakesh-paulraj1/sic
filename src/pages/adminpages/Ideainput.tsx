import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { LabelInputContainer } from '../adminpages/Login';
import { toast,ToastContainer } from 'react-toastify';
import axios from 'axios';
import Papa from 'papaparse';
import Topbar from '../../components/Topbar';
import { BACKEND_URL } from '../../../config';
import { Select } from '../../components/ui/Input';

const Ideainput = () => {
  const [formData, setFormData] = useState({
    idea_title: '',
    school: '',
    student_name: '',
    type: '',
    idea_description: '',
    status_id: '3', 
    theme_id: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const requiredFields = [
      'student_name',
      'school',
      'type',
      'idea_description',
      'idea_title',
      'theme_id', // Added this as it's part of the form
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  // Function to handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // Assuming the CSV has headers that match the form field names
          const csvData = results.data[0]; // Taking the first row for simplicity
          setFormData({
            ...formData,
            ...csvData,
          });
        },
        error: function (error) {
          console.error('Error parsing CSV file:', error);
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
   
    e.preventDefault();
    if (!validateForm()) {
      toast.error(errors);
    console.log(errors);
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/register_idea.php`, formData, {
        withCredentials: true,
      });

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

  return (
    <div>
      <Navbar />
      <Topbar />
      <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">
        <div className="bg-sky-900 text-white text-3xl font-bold py-4 px-6 text-center">
          Idea Input
        </div>
        <Link to="/admindashboard">
          <button className="bg-cyan-900 mt-4 text-white py-2 px-4 rounded-md hover:bg-cyan-800">
            Back
          </button>
        </Link>

        <form className="p-6 md:p-9 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LabelInputContainer className="mb-4">
              <Label htmlFor="csvFile">Upload CSV</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="student_name">Student Name</Label>
              <Input
                id="student_name"
                placeholder="Student Name"
                name="student_name"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.student_name}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="theme_id">Theme Preference</Label>
              <Select
                id="theme_id"
                name="theme_id"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.theme_id}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select a theme
                </option>
                <option value="1">Food Processing/Nutrition/Biotech</option>
                <option value="2">Healthcare & Biomedical devices</option>
                <option value="3">
                  ICT, Cyber-physical systems, Blockchain, Cognitive computing, Cloud computing, AI & ML
                </option>
                <option value="4">Infrastructure</option>
                <option value="5">IoT based technologies</option>
                <option value="6">Consumer Goods and Retail</option>
                <option value="7">Defence & Security</option>
                <option value="8">Education</option>
                <option value="9">Fashion and Textiles</option>
                <option value="10">Finance Life Sciences</option>
                <option value="11">Agriculture & Rural Development</option>
                <option value="12">Clean & Potable water</option>
                <option value="13">Software-Web App Development</option>
                <option value="14">Sports & Fitness</option>
                <option value="15">Sustainable Environment</option>
                <option value="16">Travel & Tourism</option>
                <option value="17">Waste Management/Waste to Wealth Creation</option>
                <option value="18">Smart Cities</option>
                <option value="19">Smart Education</option>
                <option value="20">Smart Textiles</option>
                <option value="21">Smart Vehicles/Electric vehicle</option>
                <option value="22">Software-Mobile App Development</option>
                <option value="23">Manufacturing</option>
                <option value="24">Mining, Metals, Materials</option>
                <option value="25">Other Emerging Areas Innovation for Start-ups</option>
                <option value="26">Renewable and Affordable Energy</option>
                <option value="27">Robotics and Drones</option>
                <option value="28">Venture Planning and Enterprise/Startup</option>
                <option value="29">IP Generation & Protection</option>
                <option value="30">Business Modeling/Plan Development</option>
                <option value="31">Design Thinking</option>
                <option value="32">Idea Generation & Validation</option>
                <option value="33">Incubation/Innovation Management</option>
                <option value="34">Investment and Market Analyst</option>
              </Select>
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                placeholder="School"
                name="school"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.school}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                placeholder="Type"
                name="type"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.type}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="idea_title">Idea Title</Label>
              <Input
                id="idea_title"
                placeholder="Idea Title"
                name="idea_title"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.idea_title}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="idea_description">Idea Description</Label>
              <Input
                id="idea_description"
                placeholder="Idea Description"
                name="idea_description"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.idea_description}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

           
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 font-semibold rounded-md hover:bg-blue-700 transition duration-300">
            Add Idea
          </button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Ideainput;
