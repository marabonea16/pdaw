export interface User {
    id: number;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    password: string;
    uni_id: string;
    access_token?: string;  // Optional if only sent on login
    role_data?: Student | Teacher | Admin;  // Role-specific data
}

export interface Faculty {
    id: number;
    name: string;
    code: string;
}

export interface Department {
    id: number;
    name: string;
}

export interface Major {
    id: number;
    name: string;
    code: string;
    faculty_id: number;
}

export interface Course {
    id: number;
    name: string;
    description: string;
    code: string;
    semester: string;
    year: string;
    credits: number;
    instructor_id: string;
    major_id: number;
    mandatory: boolean;
}

export interface ActivityType {
    id: number;
    name: string;
}

export interface CourseActivity {
    id: number;
    course_id: number;
    activity_type_id: number;
}

export interface Student {
    id: string;  // Matches users.uni_id
    major_id: number;
    semester: string;
    year: string;
}

export interface StudentCourse {
    student_id: string;
    course_id: number;
    exam_grade: number;
    activity_grade: number;
    final_grade: number;
}

export interface Teacher {
    id: string;  // Matches users.uni_id
    department_id: number;
    level: string;
}

export interface TeacherCourse {
    teacher_id: string;
    course_id: number;
}

export interface Admin {
    id: string;  // Matches users.uni_id
    position: string;
    faculty_id: number;
}
