// @ts-nocheck
import Navbar from '../components/Navbar';
import {  Input, Select } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { LabelInputContainer } from './adminpages/Login';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from "../../config";

import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import LanguageDropdown from '../components/Languagedropdown';
import { span } from 'framer-motion/client';
const EvaluatorRegistration = () => {
  const [Themes, setThemes] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    gender: '',
    alternate_email: '',
    phone_number: '',
    alternate_phone_number: '',
    college_name: '',
    designation: '',
    total_experience: '',
    city: '',
    state: '',
    knowledge_domain: '',
    theme_preference_1: '',
    theme_preference_2: '',
    theme_preference_3: '',
    expertise_in_startup_value_chain: '',
    role_interested: '',
    delete_status: "0",
    evaluator_status:"3",
    languages_known:[],

  });
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/get_themes.php`, {
          withCredentials: true,
        });
       
  
        // Check if `themes` exists in the API response
        if (response.data && response.data.themes) {
          setThemes(response.data.themes);
          // Populate the Themes state
        } else {
          console.error("Themes key is missing in API response.");
        }
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };
  
    fetchThemes();
  }, []);
  


  
  const [errors, setErrors] = useState({});
  const validateThemePreferences = (field: string, value: any, formData: Record<string, any>) => {
   
    
    const themeFields = ['theme_preference_1', 'theme_preference_2', 'theme_preference_3'];
  
  
    const otherFields = themeFields.filter(f => f !== field);
  
    // Check if any of the other fields have the same value
    for (const otherField of otherFields) {
      if (formData[otherField] === value) {
        return `${field.replace(/_/g, ' ')} should not have the same value as ${otherField.replace(/_/g, ' ')}`;
      }
    }
    return null;
  };
  
  const validateForm = () => {
    const requiredFields = [
      'email', 'password', 'first_name', 'last_name', 'gender', 
      'phone_number', 'college_name', 'designation', 
      'total_experience', 'city', 'state', 'knowledge_domain', 
      'theme_preference_1', 'theme_preference_2', 'theme_preference_3', 
      'expertise_in_startup_value_chain', 'role_interested','languages_known'
    ];

    const newErrors: Record<string, string> = requiredFields.reduce((errors: Record<string, string>, field: string) => {
      const value = formData[field as keyof typeof formData];

      if (!value && value !== 0) {
        errors[field] = `${field.replace(/_/g, ' ')} is required`;
        return errors;
      }
      if (field.startsWith("theme_preference")) {
        const duplicateError = validateThemePreferences(field, value, formData);
        if (duplicateError) {
          errors[field] = duplicateError;
          return errors;
        }
      }

      if (field === 'first_name' || field === 'last_name' || field === 'gender') {
        const wordCount = String(value).trim().split(/\s+/).length;
        if (wordCount > 1) {
          errors[field] = `${field.replace(/_/g, ' ')} should not exceed a single word`;
        }
      }

      if (field === 'phone_number') {
        if (!/^\d{10}$/.test(String(value))) {  // Ensure it's exactly 10 digits
          errors[field] = `${field.replace(/_/g, ' ')} should be a 10-digit number`;
        }
      }

      if (field === 'city' || field === 'state') {
        const wordCount = String(value).trim().split(/\s+/).length;
        if (wordCount > 3) {
          errors[field] = `${field.replace(/_/g, ' ')} should not exceed 3 words`;
        }
      }

      if (field === 'college_name') {
        const wordCount = String(value).trim().split(/\s+/).length;
        if (wordCount > 5) {
          errors[field] = `${field.replace(/_/g, ' ')} should not exceed 5 words`;
        }
      }

      if (field === 'designation') {
        const wordCount = String(value).trim().split(/\s+/).length;
        if (wordCount > 3) {
          errors[field] = `${field.replace(/_/g, ' ')} should not exceed 3 words`;
        }
      }

      if (field === 'total_experience') {
        if (!/^\d+$/.test(String(value))) {  // Ensure it's a single number
          errors[field] = `${field.replace(/_/g, ' ')} should be a single number`;
        }
      }

      return errors;
    }, {});

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (validateForm()) {
      try {

        const response = await toast.promise(
          axios.post(`${BACKEND_URL}/register_evaluator.php`, formData, {
            withCredentials: true,
          }),
          {
            pending: 'Submitting...',
          }
        );

        if (response.data.message) {
          toast.success(response.data.message+"Please wait till the  admin approves your request");;
        } else {
        toast.error(response.data.error);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Unable to Submit');
      }
    }
  };





  return (
    <div>
      <Navbar />
      <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">
        <div className="bg-sky-900 text-white text-3xl font-bold py-4 px-6 text-center">
          Evaluator Registration
        </div>
<Link to="/"> 
    <button className="bg-cyan-900 mt-4 text-white py-2 px-4 rounded-md hover:bg-cyan-800">Back</button>
</Link>
        <form className="p-6 md:p-9 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <LabelInputContainer className="mb-4">
            <Label htmlFor="first_name">
            First Name <span className="text-red-500">*</span>
            </Label>
              <Input
                id="first_name"
                placeholder="First Name"
                name="first_name"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="last_name">
            Last Name <span className="text-red-500">*</span>
           </Label>
              <Input
                id="last_name"
                placeholder="Last Name"
                name="last_name"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
            </Label>
              <Input
                id="email"
                placeholder="Email"
                name="email"
                type="email"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.email}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="alternate_email">Alternative Email</Label>
              <Input
                id="alternate_email"
                placeholder="Alternative Email"
                name="alternate_email"
                type="email"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.alternate_email}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
            <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
            </Label>
              <Input
                id="password"
                placeholder="Password"
                name="password"
                type="password"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.password}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="phone_number">
            Phone Number <span className="text-red-500">*</span>
            </Label>
              <Input
                id="phone_number"
                placeholder="Phone Number"
                name="phone_number"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.phone_number}
                onChange={handleInputChange}
                maxLength={10}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="alternate_phone_number">Alternative Phone Number</Label>
              <Input
                id="alternate_phone_number"
                placeholder="Alternative Phone Number"
                name="alternate_phone_number"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.alternate_phone_number}
                onChange={handleInputChange}
                maxLength={10}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
            <Label htmlFor="gender">
            Gender <span className="text-red-500">*</span>
            </Label>
              
              <Select
                id="gender"
                placeholder="Gender"
                name="gender"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.gender}
                onChange={handleInputChange}
              >
                 <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="college_name">
            College Name <span className="text-red-500">*</span>
            </Label>
              <Input
                id="college_name"
                placeholder="College Name"
                name="college_name"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.college_name}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="designation">
    Designation <span className="text-red-500">*</span>
  </Label>
              <Input
                id="designation"
                placeholder="Designation"
                name="designation"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.designation}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="total_experience">
            Total Experience <span className="text-red-500">*</span>
            </Label>
              <Input
                id="total_experience"
                placeholder="Total Experience (Years)"
                name="total_experience"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.total_experience}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="city">
            City <span className="text-red-500">*</span>
            </Label>
              <Input
                id="city"
                placeholder="City"
                name="city"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.city}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="state">
            State <span className="text-red-500">*</span>
            </Label>
              <Input
                id="state"
                placeholder="State"
                name="state"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.state}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
  <Label htmlFor="knowledge_domain">Knowledge Domain</Label>
  <Select
    id="knowledge_domain"
    name="knowledge_domain"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.knowledge_domain}
    onChange={handleInputChange}
  >
    <option value="" disabled>Select Knowledge Domain</option>
    <option value="Agriculture and Rural Development">Agriculture and Rural Development</option>
    <option value="Clean Water">Clean Water</option>
    <option value="Energy / Renewable Energy">Energy / Renewable Energy</option>
    <option value="Finance">Finance</option>
    <option value="Food Technology">Food Technology</option>
    <option value="Healthcare & Biomedical Devices">Healthcare & Biomedical Devices</option>
    <option value="Life Sciences">Life Sciences</option>
    <option value="Miscellaneous">Miscellaneous</option>
    <option value="Robotics & Drones">Robotics & Drones</option>
    <option value="Security & Surveillance">Security & Surveillance</option>
    <option value="Smart Cities">Smart Cities</option>
    <option value="Smart Communication">Smart Communication</option>
    <option value="Smart Education">Smart Education</option>
    <option value="Smart Textiles">Smart Textiles</option>
    <option value="Smart Vehicles">Smart Vehicles</option>
    <option value="Software - Mobile App Development">Software - Mobile App Development</option>
    <option value="Software - Web App Development">Software - Web App Development</option>
    <option value="Sports and Fitness">Sports and Fitness</option>
    <option value="Sustainable Environment">Sustainable Environment</option>
    <option value="Travel and Tourism">Travel and Tourism</option>
    <option value="Waste Management">Waste Management</option>
  </Select>
</LabelInputContainer>
<LabelInputContainer className="mb-4">
  
  <Label htmlFor="theme_preference_1">Theme Preference 1</Label>
            <Label htmlFor="knowledge_domain">
            Knowledge Domain <span className="text-red-500">*</span>
            </Label>
              <Input
                id="knowledge_domain"
                placeholder="Knowledge Domain"
                name="knowledge_domain"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.knowledge_domain}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
            <Label htmlFor="theme_preference_1">
            Theme Preference 1 <span className="text-red-500">*</span>
            </Label>
  <Select
    id="theme_preference_1"
    name="theme_preference_1"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.theme_preference_1}
    onChange={handleInputChange}
  >
    <option value="" disabled>Select a theme</option>
    {Themes?.map((theme) => (
      <option key={theme.id} value={theme.id}>
        {theme.theme_name}
      </option>
    ))}
  </Select>
</LabelInputContainer>



<LabelInputContainer className="mb-4">
  
  <Label htmlFor="theme_preference_2">Theme Preference 2</Label>
<Label htmlFor="theme_preference_2">
Theme Preference 2 <span className="text-red-500">*</span>
</Label>
  <Select
    id="theme_preference_2"
    name="theme_preference_2"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.theme_preference_2}
    onChange={handleInputChange}
  >
    <option value="" disabled>Select a theme</option>
    {Themes?.map((theme) => (
      <option key={theme.id} value={theme.id}>
        {theme.theme_name}
      </option>
    ))}
  </Select>
</LabelInputContainer>

<LabelInputContainer className="mb-4">
  
  <Label htmlFor="theme_preference_3">Theme Preference 3</Label>
<Label htmlFor="theme_preference_3">
Theme Preference 3 <span className="text-red-500">*</span>
</Label>
  <Select
    id="theme_preference_3"
    name="theme_preference_3"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.theme_preference_3}
    onChange={handleInputChange}
  >
    <option value="" disabled>Select a theme</option>
    {Themes?.map((theme) => (
      <option key={theme.id} value={theme.id}>
        {theme.theme_name}
      </option>
    ))}
  </Select>
</LabelInputContainer>




    
            <LabelInputContainer className="mb-4">
            <Label htmlFor="expertise_in_startup_value_chain">
            Area of Expertise in Startup Value Chain <span className="text-red-500">*</span>
            </Label>
              <Select
    id="expertise_in_startup_value_chain"
    name="expertise_in_startup_value_chain"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.expertise_in_startup_value_chain}
    onChange={handleInputChange}
  >
    
    <option value="Business Modeling/Plan Development">Business Modeling/Plan Development</option>
    <option value="Design Thinking">Design Thinking</option>
    <option value="Idea Generation & Validation">Idea Generation & Validation</option>
    <option value="
Incubation/Innovation Management">
    Incubation/Innovation Management</option>
    <option value="Investment and Market Analyst">
    Investment and Market Analyst</option>   
    <option value="IP Generation & Protection">
IP Generation & Protection</option>   <option value="
PoC Validation">
   PoC Validationt</option>   <option value="
Policy Expert (Start-up and Innovations)">
   Policy Expert (Start-up and Innovations)</option>   <option value="

Prototype Development">
Prototype Development</option>   <option value="
Technology Transfer">
    Technology Transfer</option>   <option value="
Venture Planning and Enterprise/Startup">
    Venture Planning and Enterprise/Startup</option>   
  
  </Select>
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
            <Label htmlFor="role_interested">
Role Interested <span className="text-red-500">*</span>

</Label>
              <Select
    id="role_interested"
    name="role_interested"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.role_interested}
    onChange={handleInputChange}
  >
    <option value="Mentor">Mentor</option>
    <option value="Evaluator">Evaluator</option>
    <option value="Expert Speaker">Expert Speaker</option>
    <option value="Investor">Investor</option>
    <option value="Product Designer">Product Designer</option>
    <option value="IP Expert">IP Expert</option>
    <option value="Prototype Development">Prototype Development</option>

  </Select>
            </LabelInputContainer>



            <LanguageDropdown formData={formData} setFormData={setFormData} />
           

             </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 font-semibold rounded-md hover:bg-blue-700 transition duration-300"
           >
            Register
          </button>
        </form>
        
      </div>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
/>
    </div>
  );
};

export default EvaluatorRegistration;