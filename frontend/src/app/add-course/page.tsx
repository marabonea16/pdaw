'use client';

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { User, Major } from "@/types";
import { redirect } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoutes";

const AddCoursePage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    code: "",
    semester: "",
    year: "",
    credits: "",
    instructor_id: "",
    major_id: "",
    mandatory: false
  });

  const [teachers, setTeachers] = useState<User[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

   if (!session) {
            redirect("/");
        }

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("http://localhost:8000/teachers");
        if (res.ok) {
          const data = await res.json();
          setTeachers(data);
          console.log("Fetched teachers:", data);
        } else {
          console.error("Failed to fetch teachers");
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const res = await fetch("http://localhost:8000/majors");
        if (res.ok) {
          const data = await res.json();
          setMajors(data);
          console.log("Fetched majors:", data);
        } else {
          console.error("Failed to fetch majors");
        }
      } catch (error) {
        console.error("Error fetching majors:", error);
      }
    };

    fetchMajors();
  }, []);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
  setForm({ ...form, [e.target.name]: value });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        toast.success("Course created successfully!");

        const newCourse = await res.json(); 
        const courseId = newCourse.id;
        const linkRes = await fetch("http://localhost:8000/teacher_courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacher_id: form.instructor_id,
            course_id: courseId,
          }),
        });

        if (!linkRes.ok) {
          toast.warn("Course created, but failed to assign teacher.");
        } else {
          toast.success("Course and teacher assigned successfully!");
        }

        const bulkAssignRes = await fetch("http://localhost:8000/student_courses/bulk_assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_id: courseId,
            major_id: form.major_id,
            year: form.year,
            semester: form.semester
          }),
        });

        if (!bulkAssignRes.ok) {
          toast.warn("Course created, but failed to assign students.");
        } else {
          toast.success("Course assigned to students successfully!");
        }

        

        setForm({
          name: "",
          description: "",
          code: "",
          semester: "",
          year: "",
          credits: "",
          instructor_id: "",
          major_id: "",
          mandatory: false
        });
      } else {
        const error = await res.text();
        toast.error("Failed to create course: " + error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <ProtectedRoute>
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <section className="py-20 md:py-30 pl-64 flex items-center justify-center">
        <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-md w-2/3">
          <h1 className="text-3xl font-bold text-[#2F4F83] mb-10">Add New Course</h1>
          <form onSubmit={handleSubmit} className="mx-auto text-left">
            {[
              { label: "Name", name: "name" },
              { label: "Description", name: "description" },
              { label: "Code", name: "code" },
              { label: "Semester", name: "semester" },
              { label: "Year", name: "year" },
              { label: "Credits", name: "credits" }
            ].map(({ label, name }) => (
              <div className="mb-4" key={name}>
                <label className="block text-md font-medium text-gray-600">{label}</label>
                <input
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-md font-medium text-gray-600">Instructor</label>
              <select
                name="instructor_id"
                value={form.instructor_id}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
              >
                <option value="">Select Instructor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.uni_id} value={teacher.uni_id}>
                    {teacher.uni_id} - {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-md font-medium text-gray-600">Major</label>
              <select
                name="major_id"
                value={form.major_id}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-800 sm:text-sm"
              >
                <option value="">Select Major</option>
                {majors.map((major) => (
                  <option key={major.id} value={major.id}>
                    ID {major.id} - {major.code} - {major.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mandatory"
                  name="mandatory"
                  checked={form.mandatory}
                  onChange={(e) => setForm({ ...form, mandatory: e.target.checked })}
                  className="h-4 w-4 text-[#2F4F83] focus:ring-[#2F4F83] border-gray-300 rounded"
                />
                <label htmlFor="mandatory" className="ml-2 block text-md font-medium text-gray-600">
                  Mandatory Course
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Check this box if this course is mandatory for the selected major.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-[#2F4F83] hover:bg-[#293547] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
          </form>
        </div>
      </section>
    </div>
  </ProtectedRoute>
  );
};

export default AddCoursePage;
