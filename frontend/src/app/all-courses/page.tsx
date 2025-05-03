'use client';

import Sidebar from "../components/sidebar";
import { Course } from "../../types"
import { useEffect, useState } from "react";
import CourseCard from "../components/courseCard";

const AllCoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [filter, setFilter] = useState<string>("all");

    const fetchCourses = async () => {
        try {
            const response = await fetch("http://localhost:8000/courses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCourses(data); 
                setFilteredCourses(data);
                console.log(data);
            } else {
                console.error("Failed to fetch courses");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleEditCourse = async (updatedCourse: Course) => {
            try {
              const response = await fetch(`http://localhost:8000/courses/${updatedCourse.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCourse),
              });
          
              if (response.ok) {
                setCourses(prev => prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
                setFilteredCourses(prev => prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
              } else {
                console.error("Failed to update course");
              }
            } catch (error) {
              console.error("Error updating course:", error);
            }
          };
          
    
    const handleDeleteCourse = async (course: Course) => {
        try {
            const response = await fetch(`http://localhost:8000/courses/${course.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            });
    
            if (response.ok) {
            setCourses(prevCourses => prevCourses.filter(c => c.id !== course.id));
            setFilteredCourses(prevCourses => prevCourses.filter(c => c.id !== course.id));
            } else {
            console.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
        };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100"> 
            <Sidebar />
            <div className="flex flex-col  min-h-screen bg-gray-100 border-b-2 border-gray-200 py-20 md:py-30 pl-64">
                <h1 className="text-2xl font-bold text-center text-[#2F4F83] mb-4">All Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-16 justify-center">
                    {filteredCourses.map((course) => (
                        <CourseCard 
                        key={course.id} 
                        course={course} 
                        onView={(course) => console.log('Viewing', course)}
                        onEdit={handleEditCourse}
                        onDelete={handleDeleteCourse}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

}

export default AllCoursesPage;