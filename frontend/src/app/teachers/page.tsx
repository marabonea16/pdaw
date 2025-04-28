"use client";

import Link from "next/link";

export default function TeachersPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-md">
        <h1 className="text-4xl font-bold text-[#2F4F83] mb-4">Welcome Teachers!</h1>
        <p className="text-lg text-gray-600 mb-6">
          The <strong>University Portal Technology</strong> is designed to simplify teaching tasks.
          Manage courses and grades, access schedules and connect with students effortlessly.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Sign in to access your dashboard, update schedules, and communicate with students.
        </p>

        <Link href="/sign-in">
          <button className="bg-[#2F4F83] hover:bg-[#2f3d52] text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Sign In Now
          </button>
        </Link>
      </div>
    </main>
  );
}
