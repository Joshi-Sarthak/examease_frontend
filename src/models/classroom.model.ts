export interface ClassroomData {
  classroomId: string;
  classroomName: string;
  teacherId: string;
  classroomCode: string;
  createdAt: Date;
  role?: 'teacher' | 'student';
}

  