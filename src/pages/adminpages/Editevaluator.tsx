import Navbar from '../../components/Navbar';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { LabelInputContainer } from '../adminpages/Login';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from "../../../config";
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Select  } from '../../components/ui/Input';
import { toast } from 'react-toastify';
const EditEvaluator = () => {
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
    delete_status: '',
    evaluator_status: '',
  });
  const { evaluator_id } = useParams();
  console.log(evaluator_id);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvaluatorData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}getevaluator1.php?evaluator_id=${evaluator_id}`,{
          withCredentials: true
        });
        console.log(response.data);
        setFormData(response.data.evaluator);
      } catch (error) {
        console.error("Failed to fetch evaluator data:", error);
      }
    };

    fetchEvaluatorData();
  }, []);

  const validateForm = () => {
    const requiredFields = [
      'email', 'password', 'first_name', 'last_name', 'gender', 'alternative_email', 
      'phone_number', 'alternative_phone_number', 'college_name', 'designation', 
      'total_experience', 'city', 'state', 'knowledge_domain', 
      'theme_preference_1', 'theme_preference_2', 'theme_preference_3', 
      'expertise_in_startup_value_chain', 'role_interested'
    ];
  
    const newErrors = requiredFields.reduce((errors, field) => {
      const value = formData[field];
      if (!value && value !== 0) {
        errors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
      return errors;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log(formData);
      try {
        toast.promise(
        await axios.put(`${BACKEND_URL}edit_evaluator.php`, formData, {
          withCredentials: true,
        }),{
          pending: "Updating Evaluator Details...",
        }).then((response:any)=>{
          if (response.data.message) {
            toast.success(response.data.message);
               return;
             } else {
               console.log(response.data);
             }
        });
      } catch (error) {
        console.error("Failed to update evaluator details:", error);
        toast.error('Unable to Update');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">
        <div className="bg-sky-900 text-white text-3xl font-bold py-4 px-6 text-center">
          Edit Evaluator
        </div>
        <Link to="/admindashboard"> 
          <button className="bg-cyan-900 mt-4 text-white py-2 px-4 rounded-md hover:bg-cyan-800">Back</button>
        </Link>
        <form className="p-6 md:p-9 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Map through form fields here */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="first_name">First Name</Label>
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
              <Label htmlFor="last_name">Last Name</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="alternative_email">Alternative Email</Label>
              <Input
                id="alternative_email"
                placeholder="Alternative Email"
                name="alternative_email"
                type="email"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.alternate_email}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="phone_number">Phone Number</Label>
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
              <Label htmlFor="alternative_phone_number">Alternative Phone Number</Label>
              <Input
                id="alternative_phone_number"
                placeholder="Alternative Phone Number"
                name="alternative_phone_number"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.alternate_phone_number}
                onChange={handleInputChange}
                maxLength={10}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="college_name">Gender</Label>
              <Input
                id="gender"
                placeholder="Gender"
                name="gender"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.gender}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="college_name">College Name</Label>
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
              <Label htmlFor="designation">Designation</Label>
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
              <Label htmlFor="total_experience">Total Experience</Label>
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
              <Label htmlFor="city">City</Label>
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
              <Label htmlFor="state">State</Label>
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
  <Label htmlFor="theme_preference_3">Theme Preference 1</Label>
  <Select
    id="theme_preference_3"
    name="theme_preference_3"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.theme_preference_1}
    onChange={handleInputChange}
  >
     <option value="" disabled>Select a theme</option>
    <option value="1">Food Processing/Nutrition/Biotech</option>
    <option value="2">Healthcare & Biomedical devices</option>
    <option value="3">ICT, Cyber-physical systems, Blockchain, Cognitive computing, Cloud computing, AI & ML</option>
    <option value="4">Infrastructure</option>
    <option value="5">IoT based technologies (e.g. Security & Surveillance systems etc)</option>
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
    <option value="21">Smart Vehicles/Electric vehicle/Electric vehicle motor and battery technology</option>
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
  <Label htmlFor="theme_preference_3">Theme Preference 3</Label>
  <Select
    id="theme_preference_3"
    name="theme_preference_3"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.theme_preference_2}
    onChange={handleInputChange}
  >
   <option value="" disabled>Select a theme</option>
    <option value="1">Food Processing/Nutrition/Biotech</option>
    <option value="2">Healthcare & Biomedical devices</option>
    <option value="3">ICT, Cyber-physical systems, Blockchain, Cognitive computing, Cloud computing, AI & ML</option>
    <option value="4">Infrastructure</option>
    <option value="5">IoT based technologies (e.g. Security & Surveillance systems etc)</option>
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
    <option value="21">Smart Vehicles/Electric vehicle/Electric vehicle motor and battery technology</option>
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
  <Label htmlFor="theme_preference_3">Theme Preference 3</Label>
  <Select
    id="theme_preference_3"
    name="theme_preference_3"
    className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
    value={formData.theme_preference_3}
    onChange={handleInputChange}
  >
    <option value="" disabled>Select a theme</option>
    <option value="1">Food Processing/Nutrition/Biotech</option>
    <option value="2">Healthcare & Biomedical devices</option>
    <option value="3">ICT, Cyber-physical systems, Blockchain, Cognitive computing, Cloud computing, AI & ML</option>
    <option value="4">Infrastructure</option>
    <option value="5">IoT based technologies (e.g. Security & Surveillance systems etc)</option>
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
    <option value="21">Smart Vehicles/Electric vehicle/Electric vehicle motor and battery technology</option>
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
              <Label htmlFor="expertise_in_startup_value_chain">Expertise in Startup Value Chain</Label>
              <Input
                id="expertise_in_startup_value_chain"
                placeholder="Expertise in Startup Value Chain"
                name="expertise_in_startup_value_chain"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.expertise_in_startup_value_chain}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="role_interested">Role Interested</Label>
              <Input
                id="role_interested"
                placeholder="Role Interested"
                name="role_interested"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.role_interested}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
            
            
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 font-semibold rounded-md hover:bg-blue-700 transition duration-300"
           >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvaluator;
