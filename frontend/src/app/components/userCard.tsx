'use client';

import { useState } from "react";
import { User } from "../../types";
import { Eye, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserCardProps {
  user: User;
  currentUser: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, currentUser, onView, onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const canEditOrDelete = () => {
    if (user.role === 'superadmin') {
      return false;
    }
    if (user.role === 'admin') {
      return currentUser.role === 'superadmin';
    }
    return currentUser.role === 'admin' || currentUser.role === 'superadmin';
  };

  const handleConfirmDelete = () => {
    onDelete(user);
    setIsDeleteDialogOpen(false);
  };

  const handleSaveEdit = () => {
    onEdit(editedUser);
    setIsEditDialogOpen(false);
  };

  const handleChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={() => onView(user)} className="text-gray-500 hover:text-blue-600 transition-colors">
          <Eye size={20} />
        </button>

        {canEditOrDelete() && (
          <button onClick={() => setIsEditDialogOpen(true)} className="text-gray-500 hover:text-green-600 transition-colors">
            <Pencil size={20} />
          </button>
        )}

        {canEditOrDelete() && (
          <button 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash size={20} />
          </button>
        )}
      </div>

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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{user.first_name} {user.last_name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user details below and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">First Name</Label>
              <Input 
                value={editedUser.first_name} 
                onChange={(e) => handleChange('first_name', e.target.value)} 
              />
            </div>

            <div>
              <Label className="mb-2 block">Last Name</Label>
              <Input 
                value={editedUser.last_name} 
                onChange={(e) => handleChange('last_name', e.target.value)} 
              />
            </div>

            <div>
              <Label className="mb-2 block">Email</Label>
              <Input 
                value={editedUser.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
              />
            </div>

            <div>
              <Label className="mb-2 block">Role</Label>
              <select
                value={editedUser.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentUser?.role === 'superadmin' && editedUser.role === 'admin' && (
                  <option value="superadmin">Superadmin</option>
                )}
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div>
              <Label className="mb-2 block">University ID</Label>
              <Input 
                value={editedUser.uni_id} 
                onChange={(e) => handleChange('uni_id', e.target.value)} 
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default UserCard;
