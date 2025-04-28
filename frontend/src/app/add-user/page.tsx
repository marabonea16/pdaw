'use client';

import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';


const AddUserPage = () => {
    const [form, setForm] = useState({
        first_name:"",
        last_name: "",
        email: "",
        password: "",
        role: "student", 
        uni_id: "",
      });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const email = `${form.first_name.toLowerCase()}.${form.last_name.toLowerCase()}@gmail.com`;
        setForm((prev) => ({
          ...prev,
          email,
          password: email, 
        }));
      }, [form.first_name, form.last_name]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
    
        try {
          const response = await fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
    
          if (response.ok) {
            toast.success("User created successfully!");
            setForm({
              first_name: "",
              last_name: "",
              email: "",
              password: "",
              role: "student",
              uni_id: "",
            });
          } else {
            const errorData = await response.text();
            console.log(errorData);
            toast.error("Failed to create user");
          }
        } catch (err) {
          console.error(err);
          toast.error("An error occurred.");
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar/>
          <section className="py-20 md:py-30 pl-64 flex items-center justify-center">
            <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-md w-2/3">
                <h1 className="text-3xl font-bold text-[#2F4F83] mb-10">Create New User</h1>
                <form onSubmit={handleSubmit} className="mx-auto text-left">
                    <div className="mb-4">
                        <label className="block text-md font-medium text-gray-600">First Name</label>
                        <input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                        />
                    </div>
            
                    <div className="mb-4">
                        <label className="block text-md font-medium text-gray-600">Last Name</label>
                        <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                        />
                    </div>
            
                    <div className="mb-4">
                        <label className="block text-md font-medium text-gray-600">Email (Auto-generated)</label>
                        <input
                        type="email"
                        name="email"
                        value={form.email}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-100 bg-gray-100 rounded-md shadow-sm text-gray-600 cursor-not-allowed sm:text-sm"
                        />
                    </div>
            
                    <div className="mb-4">
                        <label className="block text-md font-medium text-gray-600">Password (Auto-generated)</label>
                        <input
                        type="text"
                        name="password"
                        value={form.password}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-100 bg-gray-100 rounded-md shadow-sm text-gray-600 cursor-not-allowed sm:text-sm"
                        />
                    </div>
            
                    <div className="mb-4">
                        <label className="block text-md font-medium text-gray-600">Role</label>
                        <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                        >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                        </select>
                    </div>
                      <div className="mb-4">
                      <label className="block text-md font-medium text-gray-600">University ID</label>
                      <input
                          name="uni_id"
                          value={form.uni_id}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                      />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-[#2F4F83] hover:bg-[#293547] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                        {loading ? "Creating..." : "Create User"}
                    </button>
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
                </form>
            </div>
          </section>
        </div>
      );
}

export default AddUserPage;
