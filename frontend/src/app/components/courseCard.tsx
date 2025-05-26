'use client';

import { useState, useEffect } from "react";
import { Pencil, Trash, Eye, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Course, User, StudentCourse } from "../../types";
import { set } from "zod";

// Extended type for CourseCard with student name
interface StudentCourseWithName extends StudentCourse {
  student_name: string;
}

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  instructors: User[];
  currentUser: User;
  // Add these props for API calls
  onFetchStudents?: (courseId: string) => Promise<StudentCourseWithName[]>;
  onUpdateGrades?: (studentId: string, courseId: string, grades: {
    exam_grade?: number;
    activity_grade?: number;
    final_grade?: number;
  }) => Promise<void>;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEdit, 
  onDelete, 
  instructors,
  currentUser,
  onFetchStudents,
  onUpdateGrades
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course>(course);
  const [students, setStudents] = useState<StudentCourseWithName[]>([]);
  const [loading, setLoading] = useState(false);
  const [instructor, setInstructor] = useState<User | null>(null);
  const [gradingChanges, setGradingChanges] = useState<{[key: string]: Partial<StudentCourseWithName>}>({});

  const handleChange = (field: keyof Course, value: string | number | boolean) => {
    setEditedCourse(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchUserByUniId = async (user_uni_id: string): Promise<User> => {
    const response = await fetch(`http://localhost:8000/users/uni_id/${user_uni_id}`);
    if (!response.ok) {
      throw new Error('User not found');
    }
    return await response.json();
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUserByUniId(course.instructor_id);
        setInstructor(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    loadUser();
  }, [course.instructor_id]);

  const canEditOrDelete = () => {
    if (currentUser.role === 'superadmin' || currentUser.role === 'admin') {
      return true;
    }
    return false;
  };

  const handleConfirmDelete = () => {
    onDelete(course);
    setIsDeleteDialogOpen(false);
  };

  const handleSaveEdit = () => {
    onEdit(editedCourse);
    setIsEditDialogOpen(false);
  };

  const handleViewCourse = async () => {
    setIsViewDialogOpen(true);
    if (onFetchStudents) {
      setLoading(true);
      try {
        const courseStudents = await onFetchStudents(course.id.toString());
        setStudents(courseStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGradeChange = (studentId: string, gradeType: 'exam_grade' | 'activity_grade' | 'final_grade', value: string) => {
    const numericValue = value === '' ? undefined : parseFloat(value);
    setGradingChanges(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [gradeType]: numericValue
      }
    }));
  };

  const handleSaveGrades = async (studentId: string) => {
    if (onUpdateGrades && gradingChanges[studentId]) {
      try {
        await onUpdateGrades(studentId, course.id.toString(), gradingChanges[studentId]);
        
        // Update local state
        setStudents(prev => prev.map(student => 
          student.student_id === studentId 
            ? { ...student, ...gradingChanges[studentId] }
            : student
        ));
        
        // Clear changes for this student
        setGradingChanges(prev => {
          const newChanges = { ...prev };
          delete newChanges[studentId];
          return newChanges;
        });
        
        // You might want to show a success message
      } catch (error) {
        console.error('Error updating grades:', error);
        // You might want to show an error message
      }
    }
  };

  const getDisplayValue = (student: StudentCourseWithName, field: 'exam_grade' | 'activity_grade' | 'final_grade') => {
    const changedValue = gradingChanges[student.student_id]?.[field];
    if (changedValue !== undefined) {
      return changedValue.toString();
    }
    return student[field]?.toString() || '';
  };

  const hasChanges = (studentId: string) => {
    return gradingChanges[studentId] && Object.keys(gradingChanges[studentId]).length > 0;
  };

  // Permission helpers
  const canViewAllGrades = () => {
    return ['admin', 'superadmin'].includes(currentUser.role);
  };

  const canEditGrades = () => {
    return currentUser.role === 'teacher' && course.instructor_id === currentUser.uni_id;
  };

  const canViewOwnGrades = () => {
    return currentUser.role === 'student';
  };

  const shouldShowStudent = (student: StudentCourseWithName) => {
    if (canViewAllGrades() || canEditGrades()) {
      return true;
    }
    if (canViewOwnGrades()) {
      return student.student_id === currentUser.uni_id;
    }
    return false;
  };

  const getFilteredStudents = () => {
    return students.filter(shouldShowStudent);
  };

  // Helper function to determine if a field is a number
  const isNumberField = (field: string) => {
    return ['semester', 'year', 'credits', 'major_id'].includes(field);
  };

  // Helper function to determine if a field is a boolean
  const isBooleanField = (field: string) => {
    return field === 'mandatory';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={handleViewCourse} className="text-gray-500 hover:text-blue-600">
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

      <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
      <p className="text-gray-600"><strong>Code:</strong> {course.code}</p>
      <p className="text-gray-600"><strong>Semester:</strong> {course.semester}</p>
      <p className="text-gray-600"><strong>Year:</strong> {course.year}</p>
      <p className="text-gray-600"><strong>Credits:</strong> {course.credits}</p>
      <p className="text-gray-600"><strong>Instructor:</strong> {instructor?.first_name} {instructor?.last_name}</p>
      <p className="text-gray-600"><strong>Major ID:</strong> {course.major_id}</p>
      <p className="text-gray-600"><strong>Mandatory:</strong> {course.mandatory ? "Yes" : "No"}</p>
      <p className="text-gray-600 mt-2">{course.description}</p>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
       <DialogContent className="w-screen max-w-7xl h-screen max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Details - {course.name}</DialogTitle>
            <DialogDescription>
              Course information and enrolled students with grading options
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Course Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-3">Course Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Code:</strong> {course.code}</p>
                <p><strong>Name:</strong> {course.name}</p>
                <p><strong>Semester:</strong> {course.semester}</p>
                <p><strong>Year:</strong> {course.year}</p>
                <p><strong>Credits:</strong> {course.credits}</p>
                <p><strong>Instructor:</strong> {instructor?.first_name} {instructor?.last_name}</p>
                <p><strong>Major ID:</strong> {course.major_id}</p>
                <p><strong>Mandatory:</strong> {course.mandatory ? "Yes" : "No"}</p>
              </div>
              {course.description && (
                <div className="mt-3">
                  <p><strong>Description:</strong> {course.description}</p>
                </div>
              )}
            </div>

            {/* Students Table */}
            <div>
              <h4 className="text-lg font-semibold mb-3">
                {canViewAllGrades() ? 'All Enrolled Students' : 
                 canEditGrades() ? 'Students to Grade' : 
                 'Your Grades'}
              </h4>
              {loading ? (
                <div className="text-center py-4">Loading students...</div>
              ) : getFilteredStudents().length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        {(canViewAllGrades() || canEditGrades()) && (
                          <>
                            <th className="border border-gray-300 px-4 py-2 text-left">Student ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                          </>
                        )}
                        {canViewOwnGrades() && !canViewAllGrades() && !canEditGrades() && (
                          <th className="border border-gray-300 px-4 py-2 text-left">Grade Type</th>
                        )}
                        <th className="border border-gray-300 px-4 py-2 text-left">Exam Grade</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Activity Grade</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Final Grade</th>
                        {canEditGrades() && (
                          <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredStudents().map((student) => (
                        <tr key={student.student_id} className="hover:bg-gray-50">
                          {(canViewAllGrades() || canEditGrades()) && (
                            <>
                              <td className="border border-gray-300 px-4 py-2">{student.student_id}</td>
                              <td className="border border-gray-300 px-4 py-2">{student.student_name}</td>
                            </>
                          )}
                          {canViewOwnGrades() && !canViewAllGrades() && !canEditGrades() && (
                            <td className="border border-gray-300 px-4 py-2">Your Grades</td>
                          )}
                          <td className="border border-gray-300 px-4 py-2">
                            {canEditGrades() ? (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={getDisplayValue(student, 'exam_grade')}
                                onChange={(e) => handleGradeChange(student.student_id, 'exam_grade', e.target.value)}
                                placeholder="0-100"
                                className="w-20"
                              />
                            ) : (
                              <span className={`px-2 py-1 rounded ${
                                student.exam_grade !== undefined && student.exam_grade !== null
                                  ? student.exam_grade >= 60 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {student.exam_grade !== undefined && student.exam_grade !== null 
                                  ? student.exam_grade.toFixed(1) 
                                  : 'Not graded'}
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {canEditGrades() ? (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={getDisplayValue(student, 'activity_grade')}
                                onChange={(e) => handleGradeChange(student.student_id, 'activity_grade', e.target.value)}
                                placeholder="0-100"
                                className="w-20"
                              />
                            ) : (
                              <span className={`px-2 py-1 rounded ${
                                student.activity_grade !== undefined && student.activity_grade !== null
                                  ? student.activity_grade >= 60 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {student.activity_grade !== undefined && student.activity_grade !== null 
                                  ? student.activity_grade.toFixed(1) 
                                  : 'Not graded'}
                              </span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {canEditGrades() ? (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={getDisplayValue(student, 'final_grade')}
                                onChange={(e) => handleGradeChange(student.student_id, 'final_grade', e.target.value)}
                                placeholder="0-100"
                                className="w-20"
                              />
                            ) : (
                              <span className={`px-2 py-1 rounded font-semibold ${
                                student.final_grade !== undefined && student.final_grade !== null
                                  ? student.final_grade >= 60 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {student.final_grade !== undefined && student.final_grade !== null 
                                  ? student.final_grade.toFixed(1) 
                                  : 'Not graded'}
                              </span>
                            )}
                          </td>
                          {canEditGrades() && (
                            <td className="border border-gray-300 px-4 py-2">
                              {hasChanges(student.student_id) && (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveGrades(student.student_id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save size={16} className="mr-1" />
                                  Save
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {canViewOwnGrades() && !canViewAllGrades() && !canEditGrades() 
                    ? "You are not enrolled in this course" 
                    : "No students enrolled in this course"}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              "name", "description", "semester", "year", "credits", "instructor_id", "major_id", "mandatory"
            ].map((field) => (
              <div key={field}>
                <Label className="mb-2 block capitalize">{field.replace("_", " ")}</Label>
                
                {isBooleanField(field) ? (
                  // Boolean field: mandatory
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${field}-checkbox`}
                      checked={Boolean(editedCourse[field as keyof Course])}
                      onCheckedChange={(checked) => 
                        handleChange(field as keyof Course, checked === true)
                      }
                    />
                    <label 
                      htmlFor={`${field}-checkbox`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ) : field === 'instructor_id' ? (
                  // Dropdown for instructor
                  <select
                    className="w-full border rounded-md p-2"
                    value={editedCourse.instructor_id}
                    onChange={(e) => handleChange('instructor_id', e.target.value)}
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst.uni_id} value={inst.uni_id}>
                        {inst.uni_id} - {inst.first_name} {inst.last_name}
                      </option>
                    ))}
                  </select>
                ) : isNumberField(field) ? (
                  // Number fields
                  <Input 
                    type="number"
                    value={editedCourse[field as keyof Course] as number || ''} 
                    onChange={(e) => handleChange(field as keyof Course, parseInt(e.target.value) || 0)} 
                  />
                ) : (
                  // Text fields
                  <Input 
                    type="text"
                    value={editedCourse[field as keyof Course] as string || ''} 
                    onChange={(e) => handleChange(field as keyof Course, e.target.value)} 
                  />
                )}

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