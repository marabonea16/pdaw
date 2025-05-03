'use client';

import { useState } from "react";
import { Pencil, Trash, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Course } from "../../types";

interface CourseCardProps {
  course: Course;
  onView: (course: Course) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onView, onEdit, onDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course>(course);

  const handleChange = (field: keyof Course, value: string) => {
    setEditedCourse(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmDelete = () => {
    onDelete(course);
    setIsDeleteDialogOpen(false);
  };

  const handleSaveEdit = () => {
    onEdit(editedCourse);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={() => onView(course)} className="text-gray-500 hover:text-blue-600">
          <Eye size={20} />
        </button>
        <button onClick={() => setIsEditDialogOpen(true)} className="text-gray-500 hover:text-green-600">
          <Pencil size={20} />
        </button>
        <button onClick={() => setIsDeleteDialogOpen(true)} className="text-gray-500 hover:text-red-600">
          <Trash size={20} />
        </button>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
      <p className="text-gray-600"><strong>Code:</strong> {course.code}</p>
      <p className="text-gray-600"><strong>Semester:</strong> {course.semester}</p>
      <p className="text-gray-600"><strong>Year:</strong> {course.year}</p>
      <p className="text-gray-600"><strong>Credits:</strong> {course.credits}</p>
      <p className="text-gray-600"><strong>Instructor ID:</strong> {course.instructor_id}</p>
      <p className="text-gray-600"><strong>Faculty ID:</strong> {course.faculty_id}</p>
      <p className="text-gray-600 mt-2">{course.description}</p>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{course.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update the course details below and save your changes.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {[
              "name", "description", "code", "semester", "year", "credits", "instructor_id", "faculty_id"
            ].map((field) => (
              <div key={field}>
                <Label className="mb-2 block capitalize">{field.replace("_", " ")}</Label>
                <Input 
                  value={editedCourse[field as keyof Course]} 
                  onChange={(e) => handleChange(field as keyof Course, e.target.value)} 
                />
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseCard;
