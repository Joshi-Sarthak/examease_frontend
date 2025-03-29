export interface ClassroomData {
  classroomId: string;
  classroomName: string;
  teacherId: string;
  teacherName: string;
  classroomCode: string;
  createdAt: Date;
}

export interface ClassroomStudent {
  classroomId: string;
  studentId: string;
}