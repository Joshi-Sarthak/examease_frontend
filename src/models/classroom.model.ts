export interface ClassroomData {
    students: string[];
    classroomId: string;
    classroomName: string;
    classroomCode: string; // 6-digit code for joining
    createdAt: Date;
    role? : 'teacher' | 'student';
  }
  