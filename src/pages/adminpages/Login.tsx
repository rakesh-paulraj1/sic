"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../components/ui/Input";
import { cn } from "../../utils/cn";
import { BACKEND_URL } from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admindashboard");
    } else if (role === "evaluator") {
      navigate("/evaluatordashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/signin.php`, formData, {
        withCredentials: true,
      });
  
      console.log(response.data);
      const { role, id } = response.data;
  
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", id || "");
  
      // Check for admin role
      if (role === "admin") {
        navigate("/admindashboard");
        toast.success("Admin Logged In Successfully!", { position: "top-right" });
        setTimeout(() => navigate("/admindashboard"), 500);
      } 
      // Check for evaluator role
      else if (role === "evaluator") {
        navigate("/evaluatordashboard")
        toast.success("Evaluator Logged In Successfully!", { position: "top-right" });
        setTimeout(() => navigate("/evaluatordashboard"), 500);
      } 
      // If role is neither admin nor evaluator, show error
      else {
        toast.error("Invalid Credentials. Please check your email or password.", {
          position: "top-right",
        });
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl mt-12 p-4 md:p-8 shadow-input bg-white">
        <h2 className="font-bold text-3xl flex justify-center text-neutral-800">
          Student Innovation Council
        </h2>
        <h2 className="font-bold text-xl text-neutral-800">Login</h2>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              type="password"
              required
            />
          </LabelInputContainer>

          <div className="flex flex-col items-center space-y-4">
  <button
    className="px-6 py-2 bg-black text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
    type="submit"
  >
    Login &rarr;
  </button>
  <Link
    className="px-6 py-2 bg-black text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
    to={"/evaluator_registration"}
  >
    New Evaluator &rarr;
  </Link>
</div>

        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
