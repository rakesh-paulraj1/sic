import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { LabelInputContainer } from "../adminpages/Login";
import { Link, useParams } from "react-router-dom";
import { Select } from "../../components/ui/Input";

export function ProfileEvaluatorPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    gender: "",
    alternate_email: "",
    phone_number: "",
    alternate_phone_number: "",
    college_name: "",
    designation: "",
    total_experience: "",
    city: "",
    state: "",
    knowledge_domain: "",
    theme_preference_1: "",
    theme_preference_2: "",
    theme_preference_3: "",
    expertise_in_startup_value_chain: "",
    role_interested: "",
    delete_status: "",
    evaluator_status: "",
  });
  const { evaluator_id } = useParams();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const authToken = Cookies.get("auth_token1");
    const evaluatorId = localStorage.getItem("evaluator_id");

    if (!authToken) {
      setError("You are not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    if (!evaluatorId) {
      setError("Evaluator ID is missing. Please log in again.");
      setLoading(false);
      return;
    }

    axios
      .post(
        `http://localhost/webdev/getevaluator1.php`,
        { evaluator_ids: [evaluatorId] },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      .then((response) => {
        console.log("Evaluator data:", response.data); // Debugging
        if (response.data.evaluators && response.data.evaluators.length > 0) {
          setFormData({ ...response.data.evaluators[0] });
        } else {
          setError("Evaluator not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching evaluator data:", error); // Debugging
        setError("Failed to fetch evaluator details. Please try again later.");
        setLoading(false);
      });
  }, []); // Only runs once

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const authToken = Cookies.get("auth_token1");  // Get auth_token1 from cookies
    const evaluatorId = localStorage.getItem("evaluator_id"); // Get evaluator_id from localStorage

    if (!authToken) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    if (!evaluatorId) {
      setError("Evaluator ID is missing. Please log in again.");
      return;
    }

    console.log("Submitting data:", { ...formData });  // Debugging: check form data being submitted

    axios
      .post(
        `http://localhost/webdev/updateevaluator.php`,  // Your backend URL
        { ...formData, evaluator_id: evaluatorId },  // Include evaluator_id with form data
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${authToken}`,  // Pass auth_token1 in the request headers
          },
        }
      )
      .then((response) => {
        console.log("Response:", response.data);  // Debugging: check the response
        if (response.data.success === true) {
          alert("Profile updated successfully.");
          setIsEditing(false);  // Turn off editing mode after successful update
        } else {
          alert("Failed to update profile. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);  // Debugging: check the error
        alert("Error updating profile. Please try again later.");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="mr-20 ml-20 mt-10 mb-6 bg-white rounded-lg overflow-hidden">
        <div className="bg-sky-900 text-white text-3xl font-bold py-4 px-6 text-center">
        {isEditing ? "Edit Evaluator" : "Evaluator Details"}

        </div>
        <div className="flex justify-between p-4">
        <Link to="/evaluatordashboard">
          <button className="bg-cyan-900 text-white py-2 px-4 rounded-md hover:bg-cyan-800 ">
            Back
          </button>
        </Link>
        <button
          onClick={toggleEdit}
          className="bg-cyan-900 text-white py-2 px-5 rounded-md hover:bg-cyan-800"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
        </div>
        <form className="p-6 md:p-9 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* Last Name */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* Email */}
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
                disabled={true}
              />
            </LabelInputContainer>
  
            {/* Alternative Email */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* Phone Number */}
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
                disabled={!isEditing}
                maxLength={10}
              />
            </LabelInputContainer>
  
            {/* Alternative Phone Number */}
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
                disabled={!isEditing}
                maxLength={10}
              />
            </LabelInputContainer>
  
            {/* Gender */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                placeholder="Gender"
                name="gender"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* College Name */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* Designation */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* Total Experience */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* City */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* State */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* Knowledge Domain */}
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
                disabled={!isEditing}
              />
            </LabelInputContainer>
  
            {/* Theme Preference 1 */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="theme_preference_1">Theme Preference 1</Label>
              <Select
                id="theme_preference_1"
                name="theme_preference_1"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.theme_preference_1}
                disabled={!isEditing}
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
                {/* Add your theme options here */}
              </Select>
            </LabelInputContainer>
  
            {/* Theme Preference 2 */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="theme_preference_2">Theme Preference 2</Label>
              <Select
                id="theme_preference_2"
                name="theme_preference_2"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.theme_preference_2}
                disabled={!isEditing}
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
                {/* Add your theme options here */}
              </Select>
            </LabelInputContainer>
  
            {/* Theme Preference 3 */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="theme_preference_3">Theme Preference 3</Label>
              <Select
                id="theme_preference_3"
                name="theme_preference_3"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.theme_preference_3}
                disabled={!isEditing}
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
                {/* Add your theme options here */}
              </Select>
            </LabelInputContainer>
  
            {/* Expertise in Startup Value Chain */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="expertise_in_startup_value_chain">Expertise in Startup Value Chain</Label>
              <Input
                id="expertise_in_startup_value_chain"
                placeholder="Expertise in Startup Value Chain"
                name="expertise_in_startup_value_chain"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.expertise_in_startup_value_chain}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
  
            {/* Expected Role */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="expected_role">Expected Role</Label>
              <Input
                id="expected_role"
                placeholder="Expected Role"
                name="expected_role"
                type="text"
                className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
                value={formData.role_interested}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
          </div>
  
          {isEditing && (
            <div className="mt-6 flex justify-end">
             <button
            type="submit"
            className="w-full bg-cyan-900 text-white py-3 font-semibold rounded-md hover:bg-cyan-800 transition duration-300"
           >
            Save Changes
          </button>
          
          </div>
          )}
        </form>
      </div>
    </div>
  
  
  );
}
