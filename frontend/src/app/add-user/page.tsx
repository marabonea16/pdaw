'use client';

import { User } from "@/types";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { Major, Department, Faculty, Student, Teacher, Admin } from "@/types";
import ProtectedRoute from "../components/ProtectedRoutes";


const AddUserPage = () => {
    const [form, setForm] = useState({
        first_name:"",
        last_name: "",
        email: "",
        password: "",
        role: "student", 
        uni_id: "",
        // Student fields
        major_id: "",
        semester: "",
        year: "",
        // Teacher fields
        department_id: "",
        level: "",
        // Admin fields
        position: "",
        faculty_id: "",
      });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { data: session } = useSession();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

     // State for dropdown data
    const [majors, setMajors] = useState<Major[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loadingData, setLoadingData] = useState(false);



    useEffect(() => {
      if (session?.user) {
        setCurrentUser(session.user as User);
      } else {
        console.log("No user is currently logged in");
      }
    }, [session]);
    
    useEffect(() => {
        const email = `${form.first_name.toLowerCase()}.${form.last_name.toLowerCase()}@gmail.com`;
        setForm((prev) => ({
          ...prev,
          email,
          password: email, 
        }));
      }, [form.first_name, form.last_name]);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            try {
                if (form.role === "student") {
                    const majorsRes = await fetch("http://localhost:8000/majors", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (majorsRes.ok) {
                        const majorsData = await majorsRes.json();
                        setMajors(majorsData);
                    }
                } else if (form.role === "teacher") {
                    const departmentsRes = await fetch("http://localhost:8000/departments", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (departmentsRes.ok) {
                        const departmentsData = await departmentsRes.json();
                        setDepartments(departmentsData);
                    }
                } else if (form.role === "admin") {
                    const facultiesRes = await fetch("http://localhost:8000/faculties", {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (facultiesRes.ok) {
                        const facultiesData = await facultiesRes.json();
                        setFaculties(facultiesData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dropdown data:", error);
                toast.error("Failed to load required data");
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [form.role]);

     useEffect(() => {
        setForm(prev => ({
            ...prev,
            major_id: "",
            semester: "",
            year: "",
            department_id: "",
            level: "",
            position: "",
            faculty_id: "",
        }));
    }, [form.role]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };

    const createStudentRecord = async () => {
      
      try {
        // Make sure the student data matches the Student interface
        const studentData: Student = {
          id: form.uni_id, // This should be the uni_id from the user record
          major_id: parseInt(form.major_id), // Convert to number
          semester: form.semester,
          year: form.year
        };
        
        console.log("Creating student record:", studentData);
        
        const response = await fetch("http://localhost:8000/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Student creation failed:", errorData);
          toast.error("Failed to create student record");
        } else {
          toast.success("Student record created successfully");
        }
      } catch (error) {
        console.error("Failed to create student record:", error);
        toast.error("Error creating student record");
      }
    };

    const createTeacherRecord = async () => {
      
      try {
        
        const teacherData: Teacher = {
          id: form.uni_id, // This should be the uni_id from the user record
          department_id: parseInt(form.department_id), // Convert to number
          level: form.level
        };
        
        console.log("Creating teacher record:", teacherData);
        
        const response = await fetch("http://localhost:8000/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teacherData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Teacher creation failed:", errorData);
          toast.error("Failed to create teacher record");
        } else {
          toast.success("Teacher record created successfully");
        }
      } catch (error) {
        console.error("Failed to create teacher record:", error);
        toast.error("Error creating teacher record");
      }
    };

    const createAdminRecord = async () => {
      
      try {
        const adminData: Admin = {
          id: form.uni_id, // This should be the uni_id from the user record
          faculty_id: parseInt(form.faculty_id), // Convert to number
          position: form.position
        };
        
        console.log("Creating admin record:", adminData);
        
        const response = await fetch("http://localhost:8000/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Admin creation failed:", errorData);
          toast.error("Failed to create admin record");
        } else {
          toast.success("Admin record created successfully");
        }
      } catch (error) {
        console.error("Failed to create admin record:", error);
        toast.error("Error creating admin record");
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
  
      try {
        const userToRegister = {
          email: form.email,
          role: form.role,
          first_name: form.first_name,
          last_name: form.last_name,
          password: form.password,
          uni_id: form.uni_id
        };
        const response = await fetch("http://localhost:8000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userToRegister),
        });
  
        if (response.ok) {
          toast.success("User created successfully!");
          console.log("User created successfully");
          const userData = await response.json();
    
          if (form.role === "student") {
            console.log("student");
            await createStudentRecord();
          } else if (form.role === "teacher") {
            console.log("teacher");
            await createTeacherRecord();
          } else if (form.role === "admin") {
            console.log("admin");
            await createAdminRecord();
          }

          setForm({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            role: "student",
            uni_id: "",
            major_id: "",
            semester: "",
            year: "",
            department_id: "",
            level: "",
            position: "",
            faculty_id: "",
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
      <ProtectedRoute>
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
                        {currentUser?.role === "superadmin" && (
                          <option value="admin">Admin</option>
                        )}
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

                    
                     {/* Student-specific fields */}
                    {form.role === "student" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-600">Major</label>
                                <select
                                    name="major_id"
                                    value={form.major_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loadingData}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                                >
                                    <option value="">Select a Major</option>
                                    {majors.map((major) => (
                                        <option key={major.id} value={major.id}>
                                            {major.code} - {major.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-600">Semester</label>
                                <input
                                    name="semester"
                                    value={form.semester}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                                >
                                </input>
                            </div>

                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-600">Year</label>
                                <input
                                    name="year"
                                    value={form.year}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                                >
                                </input>
                            </div>
                        </>
                    )}

                    {/* Teacher-specific fields */}
                    {form.role === "teacher" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-600">Department</label>
                                <select
                                    name="department_id"
                                    value={form.department_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loadingData}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                                >
                                    <option value="">Select a Department</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-600">Level</label>
                                <input
                                    name="level"
                                    value={form.level}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                                >
                                </input>
                            </div>
                        </>
                    )}

                    {/* Admin-specific fields */}
                    {form.role === "admin" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-600">Position</label>
                                <input
                                    name="position"
                                    value={form.position}
                                    onChange={handleChange}
                                    required                              
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-600">Faculty</label>
                                <select
                                    name="faculty_id"
                                    value={form.faculty_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loadingData}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                                >
                                    <option value="">Select a Faculty</option>
                                    {faculties.map((faculty) => (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.code} - {faculty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}


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
      </ProtectedRoute>
      );
}

export default AddUserPage;
