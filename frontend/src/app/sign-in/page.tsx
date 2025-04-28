"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });


    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      setError("Invalid email or password");
      return;
    } 
      
    toast.success("Sign-in successful");
    window.location.href = "/dashboard"; 
  };


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-md w-1/3">
        <h1 className="text-4xl font-bold text-[#2F4F83] mb-10">Sign In</h1>
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="mb-4">
            <label htmlFor="email" className="block text-md font-medium text-gray-600">
              Email
            </label> 
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-md font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-8 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-[#2F4F83] hover:bg-[#293547] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
          >
            Sign In
          </button>
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </form>
      </div>
    </main>
  );
}