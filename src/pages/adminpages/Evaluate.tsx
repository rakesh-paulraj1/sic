import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { LabelInputContainer } from "./Login";
import { Link, useParams } from "react-router-dom";
import { Select } from "../../components/ui/Input";

export function Evaluate() {
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

 
}
