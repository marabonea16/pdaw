"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '../components/sidebar';

const CreateAdminPage = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  if (session?.user?.role !== 'superadmin') {
    return <div>You do not have permission to access this page.</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Send request to create admin (this can be an API call)
    console.log('Creating user:', { username, password, role });
    // Add the logic to create a new user
  };

  return (
    <div className="min-h-screen bg-gray-100"> 
      <Sidebar/>
      <div className="container mx-auto px-50 max-w-4xl py-30">
        <h2>Create New Admin</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminPage;