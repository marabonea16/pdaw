'use client'

import { use, useEffect, useState } from 'react';
import { Building, Building2, Loader2, GraduationCap } from 'lucide-react';
import { Faculty } from '../../types';
import { Major } from '../../types';

export default function AboutPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);

  const getMajorsForFaculty = (facultyId: number) => {
    return majors.filter(major => major.faculty_id === facultyId);
  };
    const fetchFaculties = async () => {
      try {
        const res = await fetch("http://localhost:8000/faculties", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        const data = await res.json();
        setFaculties(data);
      } catch (error) {
        console.error('Failed to fetch faculties:', error);
      }
    };

    const fetchMajors = async () => {
      try {
        const res = await fetch("http://localhost:8000/majors", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        const data = await res.json();
        setMajors(data);
      } catch (error) {
        console.error('Failed to fetch majors:', error);
      }
    };
    useEffect(() => {
      fetchFaculties();
      fetchMajors();
    }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 md:px-20">
      <div className="max-w-4xl mx-auto mt-30">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">About Us</h1>
        <p className="text-lg text-gray-700 mb-10 leading-relaxed">
          <strong>Universitatea Politehnica Timișoara (UPT)</strong> is one of the most prestigious technical universities in Romania,
          founded in 1920. It has a long tradition in training engineers and researchers who contribute to technological
          development nationally and internationally. Located in the heart of Timișoara, UPT combines academic excellence,
          innovative research, and a vibrant student life. The university collaborates with major companies and institutions
          across Europe and offers a wide range of programs across its faculties.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#2F4F83]" />
            Our Faculties & Majors
          </h2>
          {faculties.length > 0 ? (
            <div className="space-y-8">
              {faculties.map((faculty) => {
                const facultyMajors = getMajorsForFaculty(faculty.id);
                return (
                  <div key={faculty.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-[#2F4F83] mb-2">
                        {faculty.code}
                      </h3>
                      <p className="text-gray-700 font-medium text-lg">{faculty.name}</p>
                    </div>
                    
                    {facultyMajors.length > 0 ? (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-[#2F4F83]" />
                          Majors
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {facultyMajors.map((major) => (
                            <li
                              key={major.id}
                              className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:bg-gray-100 transition duration-200"
                            >
                              <h5 className="font-semibold text-[#2F4F83] mb-1">
                                {major.code}
                              </h5>
                              <p className="text-gray-600 text-sm">{major.name}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      majors.length > 0 && (
                        <p className="text-gray-500 text-sm italic">No majors available for this faculty</p>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Loading faculties and majors...
            </div>
          )}
        </section>
      </div>
    </main>
  );
}