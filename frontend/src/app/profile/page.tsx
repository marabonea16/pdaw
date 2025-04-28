"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";


declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }
}


export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in"); 
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; 
  }

  if (!session?.user) {
    return null; 
  }

  const handleLogout = () => {
    signOut(); 
  }



  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 pt-20">
      <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-md w-1/3">
        <h1 className="text-4xl font-bold text-[#2F4F83] mb-4">Profile</h1>
          <div className="m-4 text-left">
            <p className="text-lg p-3 text-gray-600"><strong>Name:</strong> {session.user.name}</p>
            <p className="text-lg p-3 text-gray-600"><strong>Email:</strong> {session.user.email}</p>
            <p className="text-lg p-3 text-gray-600"><strong>Role:</strong> {session.user.role}</p>
          </div>
          <button
            className="w-full bg-[#2F4F83] hover:bg-[#2d394d] text-white font-semibold py-3 px-6 rounded-md transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
      </div>
    </main>
  );
}


