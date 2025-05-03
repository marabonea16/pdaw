'use client';

import Sidebar from "../components/sidebar";
import { User } from "../../types"
import { useEffect, useState } from "react";
import UserCard from "../components/userCard";
import { useSession } from "next-auth/react";


const AllUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const { data: session } = useSession();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    const fetchUsers = async () => {
        try {
          const response = await fetch("http://localhost:8000/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            setUsers(data); 
            setFilteredUsers(data);
            setCurrentUser(session?.user as User);
            console.log(data);
          } else {
            console.error("Failed to fetch users");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      const handleEditUser = async (updatedUser: User) => {
        try {
          const response = await fetch(`http://localhost:8000/users/${updatedUser.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          });
      
          if (response.ok) {
            setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
            setFilteredUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
            console.log(`User ${updatedUser.first_name} ${updatedUser.last_name} updated successfully.`);
          } else {
            console.error("Failed to update user");
          }
        } catch (error) {
          console.error("Error updating user:", error);
        }
      };
      

      const handleDeleteUser = async (user: User) => {
        try {
          const response = await fetch(`http://localhost:8000/users/${user.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          if (response.ok) {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
            setFilteredUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
            console.log(`User ${user.first_name} ${user.last_name} deleted successfully.`);
          } else {
            console.error("Failed to delete user");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      };
    
      useEffect(() => {
        fetchUsers();
      }, []);

      const handleFilter = (role: string) => {
        setFilter(role);
        if (role === "all") {
          setFilteredUsers(users);
        } else if (role === "admin") {
            setFilteredUsers(users.filter(user => user.role === role || user.role === "superadmin"));
        }else {
          setFilteredUsers(users.filter(user => user.role === role));
        }
      };

    return (
        <div className="min-h-screen bg-gray-100"> 
            <Sidebar/>
            <div className="flex flex-col  min-h-screen bg-gray-100 border-b-2 border-gray-200 py-20 md:py-30 pl-64">
                <div className="flex gap-4 mb-8 mt-10 justify-center">
                    <button onClick={() => handleFilter("all")} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-[#2F4F83] text-white' : 'bg-white border'}`}>All users</button>
                    <button onClick={() => handleFilter("student")} className={`px-4 py-2 rounded ${filter === 'student' ? 'bg-[#2F4F83] text-white' : 'bg-white border'}`}>Students</button>
                    <button onClick={() => handleFilter("teacher")} className={`px-4 py-2 rounded ${filter === 'teacher' ? 'bg-[#2F4F83] text-white' : 'bg-white border'}`}>Teachers</button>
                    <button onClick={() => handleFilter("admin")} className={`px-4 py-2 rounded ${filter === 'admin' ? 'bg-[#2F4F83] text-white' : 'bg-white border'}`}>Admins</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-16 justify-center">
                {currentUser && filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    onView={(user) => console.log('Viewing', user)}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
                </div>
            </div>
        </div>
    )
}

export default AllUsersPage;