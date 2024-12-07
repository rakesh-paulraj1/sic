"use client";
import React, { useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../components/ui/Input";
import { cn } from "../../utils/cn";

import { useState } from "react";
import { BACKEND_URL } from "../../../config";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify"; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';
export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    //   useEffect(() => {
    //     const cookie = Cookies.get('userdata');
    //     if (cookie) {
    //         try {
    //           const decoded = jwt_decode(cookie);
               
    //             if (decoded.role === 'admin') {
    //                 navigate("/admindashboard"); 
    //             }
    //         } catch (error) {
    //             console.error("Error parsing cookie", error);
    //         }
    //     }
    // }, [navigate]);
    useEffect(()=>{
      if(localStorage.getItem("role")=="admin"){
        navigate("/admindashboard")
    }
    })
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
    
      toast.promise(
        axios.post(`${BACKEND_URL}/signin_admin.php`, formData, { withCredentials: true }), 
        {
          pending: 'Logging in...', 
        }
      ).then(response => {
        if (response.data.message === "success") {
          toast.success("Success Logged In !", {
            position: "top-right"
          });
        }
        else {
          console.log(response.data);
          toast.error("Invalid Credentials", {
            position: "top-right"
          });
        }
        const user = response.data.role;
        localStorage.setItem("role", user);
        if (user === "admin") {
          navigate("/admindashboard");
        }
      }).catch(e => {
        console.error(e);
      });
    };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
  };
  return (<div>
    <Navbar/>
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl mt-12 p-4 md:p-8 shadow-input bg-white ">
    <h2 className="font-bold text-3xl  flex justify-center text-neutral-800 ">
Student Innovation Council
      </h2>
      <h2 className="font-bold text-xl text-neutral-800 ">
     Login
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" name="email" type="email" value={formData.email} onChange={handleInputChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <button
          className="relative w-full inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          type="submit"
        >
         <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
         Signup &rarr;
         </span>
          <BottomGradient />
        </button>
        
        <Link  className="relative w-full mt-4 inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          to={"/evaluator_registration"} >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
         New Evaluator &rarr;
         </span>
         
        </Link>
      </form>
    </div>
    <ToastContainer />

    </div>
  );
}
export const BottomGradient = () => {

  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

 export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
