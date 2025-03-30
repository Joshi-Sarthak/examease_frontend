export interface ClassroomData {
  classroomId: string;
  classroomName: string;
  teacherId: string;
  teacherName: string; //teacher's full name
  classroomCode: string;
  createdAt: Date;
  //students: string[]; // add list of student IDs
}

// remove this class
export interface ClassroomStudent {
  classroomId: string;
  studentId: string;
}