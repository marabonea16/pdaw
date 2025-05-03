export interface User {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    password: string;
    uni_id: string;
    access_token?: string;  // Optional if only sent on login
}

export interface Faculty {
    id: string;
    name: string;
    code: string;
}

export interface Department {
    id: string;
    name: string;
}

export interface Major {
    id: string;
    name: string;
    code: string;
    faculty_id: string;
}

export interface Course {
    id: string;
    name: string;
    description: string;
    code: string;
    semester: string;
    year: string;
    credits: number;
    major_id: string;
    mandatory: boolean;
}

export interface ActivityType {
    id: string;
    name: string;
}

export interface CourseActivity {
    id: string;
    course_id: string;
    activity_type_id: string;
}

export interface Student {
    id: string;  // Matches users.uni_id
    major_id: string;
    semester: string;
    year: string;
}

export interface StudentCourse {
    student_id: string;
    course_id: string;
    exam_grade: number;
    activity_grade: number;
    final_grade: number;
}

export interface Teacher {
    id: string;  // Matches users.uni_id
    department_id: string;
    level: string;
}

export interface TeacherCourse {
    teacher_id: string;
    course_id: string;
}

export interface Admin {
    id: string;  // Matches users.uni_id
    position: string;
    faculty_id: string;
}
