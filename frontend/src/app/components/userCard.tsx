'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { User, Student, Teacher, Admin } from "../../types";
import { Eye, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserCardProps {
  user: User;
  currentUser: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, currentUser, onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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

 const handleRoleDataChange = (field: string, value: string | number) => {
  setEditedUser(prev => ({
    ...prev,
    role_data: {
      ...prev.role_data,
      [field]: value,
    } as Student | Teacher | Admin, // Add type assertion
  }));
};
  const renderRoleSpecificInfo = () => {
    if (!user.role_data) return null;

   

    switch (user.role) {
      case 'student':
        const studentData = user.role_data as any;
        return (
          <div className="mt-2 space-y-1">
            
            {studentData.major_id && (
              <p className="text-gray-600">
                <span className="font-medium">Major:</span> {studentData.major_id}
              </p>
            )}
            {studentData.year && (
              <p className="text-gray-600">
                <span className="font-medium">Year:</span> {studentData.year}
              </p>
            )}
            {studentData.semester && (
              <p className="text-gray-600">
                <span className="font-medium">Semester:</span> {studentData.semester}
              </p>
            )}
          </div>
        );

      case 'teacher':
        const teacherData = user.role_data as any;
        return (
          <div className="mt-2 space-y-1">
            
            {teacherData.department_id && (
              <p className="text-gray-600">
                <span className="font-medium">Department:</span> {teacherData.department_id}
              </p>
            )}
            {teacherData.level && (
              <p className="text-gray-600">
                <span className="font-medium">Level:</span> {teacherData.level}
              </p>
            )}
          </div>
        );

      case 'admin':
        const adminData = user.role_data as any;
        return (
          <div className="mt-2 space-y-1">
            
            {adminData.faculty_id && (
              <p className="text-gray-600">
                <span className="font-medium">Faculty:</span> {adminData.faculty_id}
              </p>
            )}
            {adminData.position && (
              <p className="text-gray-600">
                <span className="font-medium">Position:</span> {adminData.position}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderRoleSpecificEditFields = () => {
    if (!editedUser.role_data) return null;

    switch (editedUser.role) {
      case 'student':
        const studentData = editedUser.role_data as any;
        return (
          <>
            
            <div>
              <Label className="mb-2 block">Major</Label>
              <Input 
                value={studentData.major_id || ''} 
                onChange={(e) => handleRoleDataChange('major_id', e.target.value)} 
              />
            </div>
             <div>
              <Label className="mb-2 block">Year</Label>
              <Input 
                value={studentData.year || ''} 
                onChange={(e) => handleRoleDataChange('year', e.target.value)} 
              />
            </div>
             <div>
              <Label className="mb-2 block">Semester</Label>
              <Input 
                value={studentData.semester || ''} 
                onChange={(e) => handleRoleDataChange('semester', e.target.value)} 
              />
            </div>
          </>
        );

      case 'teacher':
        const teacherData = editedUser.role_data as any;
        return (
          <>
            
            <div>
              <Label className="mb-2 block">Department</Label>
              <Input 
                value={teacherData.department_id || ''} 
                onChange={(e) => handleRoleDataChange('department_id', e.target.value)} 
              />
            </div>
            <div>
              <Label className="mb-2 block">Level</Label>
              <Input 
                value={teacherData.level || ''} 
                onChange={(e) => handleRoleDataChange('level', e.target.value)} 
              />
            </div>
          </>
        );

      case 'admin':
        const adminData = editedUser.role_data as any;
        return (
          <>
            
            <div>
              <Label className="mb-2 block">Faculty</Label>
              <Input 
                value={adminData.faculty_id || ''} 
                onChange={(e) => handleRoleDataChange('faculty_id', e.target.value)} 
              />
            </div>
            <div>
              <Label className="mb-2 block">Position</Label>
              <Input 
                value={adminData.position || ''} 
                onChange={(e) => handleRoleDataChange('position', e.target.value)} 
              />
            </div>
          </>
        );

      default:
        return null;
    }
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
        <button onClick={() => setIsViewDialogOpen(true)} className="text-gray-500 hover:text-blue-600 transition-colors">
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
      <p className="text-gray-600 mb-1 break-words">
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-medium">Role:</span> {user.role}
      </p>
      {(currentUser?.role == 'superadmin' || currentUser?.role == 'admin') && (
          <>
          <p><strong>University ID:</strong> {user.uni_id || "N/A"}</p>
          </>
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

            {renderRoleSpecificEditFields()}
            
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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Full information about the user.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-4">
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {(currentUser?.role == 'superadmin' || currentUser?.role == 'admin') && (
                <>
                <p><strong>University ID:</strong> {user.uni_id || "N/A"}</p>
                </>
            )}
            {renderRoleSpecificInfo()}
          </div>

          <DialogFooter className="flex justify-end gap-4 mt-6">
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default UserCard;
