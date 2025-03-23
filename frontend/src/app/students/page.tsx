"use client";

import Link from "next/link";

export default function StudentsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-2xl">
        <h1 className="text-4xl font-extrabold text-[#2F4F83] mb-4">Welcome Students!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore the <strong>University Portal Technology</strong> designed to streamline your academic experience.
          Access course materials, schedules, and communicate with faculty easily.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Sign in to unlock all features and stay updated with university news and events.
        </p>

        <Link href="/sign-in">
          <button className="bg-[#2F4F83] hover:bg-[#2a3444] text-white font-semibold py-3 px-6 rounded-lg transition-all">
            Sign In Now
          </button>
        </Link>
      </div>
    </main>
  );
}
