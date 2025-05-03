'use client'

import { Users, GraduationCap, UserCog, BookOpen, Building, Award } from "lucide-react";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [studentCount, setStudentCount] = useState<number>(0);
  const [academicStaffCount, setAcademicStaffCount] = useState<number>(0);
  const [adminStaffCount, setAdminStaffCount] = useState<number>(0);
  const [coursesCount, setCoursesCount] = useState<number>(0);
  const [facultiesCount, setFacultiesCount] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, academicRes, adminRes, coursesRes, facultiesRes] = await Promise.all([
          fetch("http://localhost:8000/students", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:8000/teachers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:8000/admins", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:8000/courses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:8000/faculties", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
         })
        ]);

        const studentsData = await studentsRes.json();
        const academicData = await academicRes.json();
        const adminData = await adminRes.json();
        const coursesData = await coursesRes.json();
        const facultiesData = await facultiesRes.json();
       
        setStudentCount(studentsData.length);
        setAcademicStaffCount(academicData.length);
        setAdminStaffCount(adminData.length);
        setCoursesCount(coursesData.length);
        setFacultiesCount(facultiesData.length);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

 
  return (
    <div className="min-h-screen bg-gray-100"> 
      <Sidebar/>
      <section className="py-20 md:py-30 pl-64 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-12">University at a Glance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-700 mb-2">{studentCount}</h3>
              <p className="text-gray-500">Students Enrolled</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-700 mb-2">{academicStaffCount}</h3>
              <p className="text-gray-500">Academic Staff</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-50 p-4 rounded-full mb-4">
                <UserCog className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-700 mb-2">{adminStaffCount}</h3>
              <p className="text-gray-500">Administrative Staff</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-amber-50 p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-700 mb-2">{coursesCount}</h3>
              <p className="text-gray-500">Courses Offered</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <Building className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-700 mb-2">{facultiesCount}</h3>
              <p className="text-gray-500">Faculties</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="bg-teal-50 p-4 rounded-full mb-4">
                <Award className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-700 mb-2">94%</h3>
              <p className="text-gray-500">Graduation Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
