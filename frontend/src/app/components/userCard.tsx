'use client';

import { User } from "../../types";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {user.first_name} {user.last_name}
      </h3>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Role:</span> {user.role}
      </p>
      {user.role === "student" && (
        <p className="text-gray-600">
          <span className="font-medium">University ID:</span> {user.uni_id || "N/A"}
        </p>
      )}
    </div>
  );
};

export default UserCard;
