'use client';

import Sidebar from "../components/sidebar";
import { Course, User, StudentCourse, Student } from "../../types"
import { useEffect, useState } from "react";
import CourseCard from "../components/courseCard";
import { useSession } from "next-auth/react";
import ProtectedRoute from "../components/ProtectedRoutes";

// Extended interface for CourseCard compatibility (adds student_name to your StudentCourse type)
interface StudentCourseWithName extends StudentCourse {
  student_name: string;
}

const AllCoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [instructors, setInstructors] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { data: session } = useSession();
    const [uniId, setUniId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);


    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await fetch(`http://localhost:8000/users/email/${session.user.email}`);
                if (res.ok) {
                    const data = await res.json();
                    setUniId(data.uni_id);
                    setUserRole(data.role);
                    setCurrentUser(data); // Set the complete user object
                } else {
                    console.error("Failed to fetch user details");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [session]);

    const fetchCourses = async () => {
        try {
            if (!uniId || !userRole) return;

            let url = "http://localhost:8000/courses";

            if (userRole === "student") {
                url = `http://localhost:8000/students/${uniId}/courses`;
            } else if (userRole === "teacher") {
                url = `http://localhost:8000/teachers/${uniId}/courses`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
                setFilteredCourses(data);
            } else {
                console.error("Failed to fetch courses");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch("http://localhost:8000/teachers");
                if (res.ok) {
                    const data = await res.json();
                    setInstructors(data);
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
        if (uniId && userRole) {
            fetchCourses();
        }
    }, [uniId, userRole]);

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
                console.error("Failed to delete course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleFetchStudents = async (courseId: string): Promise<StudentCourseWithName[]> => {
        try {
            const response = await fetch(`http://localhost:8000/courses/${courseId}/students`);
            if (!response.ok) {
                console.error("Failed to fetch students for course");
                return [];
            }

            const studentCourses: StudentCourse[] = await response.json();
            console.log("Fetched student courses:", studentCourses);
            
            // Then, fetch user details for each student to get their names
            const studentsWithNames: StudentCourseWithName[] = await Promise.all(
                studentCourses.map(async (studentCourse) => {
                    try {
                        const userResponse = await fetch(`http://localhost:8000/users/uni_id/${studentCourse.student_id}`);
                        if (userResponse.ok) {
                            const user: User = await userResponse.json();
                            return {
                                ...studentCourse,
                                student_name: `${user.first_name} ${user.last_name}`
                            };
                        } else {
                            // Fallback if user fetch fails
                            return {
                                ...studentCourse,
                                student_name: studentCourse.student_id // Use ID as fallback
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching user details for ${studentCourse.student_id}:`, error);
                        return {
                            ...studentCourse,
                            student_name: studentCourse.student_id // Use ID as fallback
                        };
                    }
                })
            );

            return studentsWithNames;
        } catch (error) {
            console.error("Error fetching students for course:", error);
            return [];
        }
    };

    // Function to update student grades
    const handleUpdateGrades = async (
        studentId: string, 
        courseId: string, 
        grades: {
            exam_grade?: number;
            activity_grade?: number;
            final_grade?: number;
        }
    ): Promise<void> => {
        try {
            // Convert courseId to number since your StudentCourse uses course_id as number
            const numericCourseId = parseInt(courseId);
            
            const response = await fetch(`http://localhost:8000/students/${studentId}/courses/${numericCourseId}/grades`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(grades),
            });

            if (!response.ok) {
                throw new Error("Failed to update grades");
            }
        } catch (error) {
            console.error("Error updating grades:", error);
            throw error; // Re-throw to let the CourseCard handle the error
        }
    };

    // Don't render anything if we don't have the current user yet
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-100"> 
                <Sidebar />
                <div className="flex flex-col min-h-screen bg-gray-100 border-b-2 border-gray-200 py-20 md:py-30 pl-64">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    return (
    <ProtectedRoute>
        <div className="min-h-screen bg-gray-100"> 
            <Sidebar />
            <div className="flex flex-col min-h-screen bg-gray-100 border-b-2 border-gray-200 py-20 md:py-30 pl-64">
                <h1 className="text-2xl font-bold text-center text-[#2F4F83] mb-4">All Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {filteredCourses.map((course) => (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            onEdit={handleEditCourse}
                            onDelete={handleDeleteCourse}
                            instructors={instructors}
                            currentUser={currentUser}
                            onFetchStudents={handleFetchStudents}
                            onUpdateGrades={handleUpdateGrades}
                        />
                    ))}
                </div>
            </div>
        </div>
    </ProtectedRoute>
    );
};

export default AllCoursesPage;