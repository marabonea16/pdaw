"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User } from "@/types";
import { toast, ToastContainer } from 'react-toastify';

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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!session?.user?.email) {
          console.error("User email is not available.");
          return;
        }

        const encodedEmail = encodeURIComponent(session.user.email);
        const response = await fetch(`http://localhost:8000/users/email/${encodedEmail}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data_email = await response.json();
          setUser(data_email);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (status === "authenticated" && session?.user?.email) {
      fetchUserData();
    }
  }, [status, session]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      setMessage("New passwords do not match.");
      return;
    }

    try {
      if (!user) {
        setMessage("User data is not available.");
        return;
      }

      const updatedUser = {
        ...user,
        password: newPassword,
      };
      const encodedId = encodeURIComponent(user.id);
      const result = await fetch(`http://localhost:8000/users/${encodedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      const data = await result.json();
      if (!result.ok) {
        setMessage(data.message || "Failed to change password.");
        return;
      }

      toast.success("Password changed successfully!");
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
      toast.error("An error occurred while updating password.");
    }
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 pt-30">
        <div className="max-w-3xl text-center bg-white p-10 shadow-lg rounded-md w-1/3">
          <h1 className="text-4xl font-bold text-[#2F4F83]">Profile</h1>
          <div className="m-4 text-left">
            <p className="text-lg p-3 text-gray-600"><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
            <p className="text-lg p-3 text-gray-600"><strong>Email:</strong> {user?.email}</p>
            <p className="text-lg p-3 text-gray-600"><strong>Role:</strong> {user?.role}</p>
            <p className="text-lg p-3 text-gray-600"><strong>University ID:</strong> {user?.uni_id}</p>
          </div>
          <p
            className="text-md font-medium text-[#2F4F83] mb-4 text-right cursor-pointer hover:underline"
            onClick={() => setShowModal(!showModal)}
          >
            Change Password
          </p>

          {showModal && (
            <div className="transition-all duration-300 ease-in-out bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F4F83]"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F4F83]"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F4F83]"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2F4F83] hover:bg-[#253b5e] text-white rounded-md transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
          <button
            className="w-full bg-[#2F4F83] hover:bg-[#2d394d] text-white font-semibold py-3 px-6 rounded-md transition-all"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </main>
    </>
  );
}
