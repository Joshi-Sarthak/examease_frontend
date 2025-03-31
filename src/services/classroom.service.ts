import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private classroomsKey = 'classrooms';
  private selectedClassroomKey = 'selectedClassroom';

  constructor() {}

  setClassroom(classroom: ClassroomData | null): void {
    localStorage.setItem(this.selectedClassroomKey, JSON.stringify(classroom));
  }

  getClassroom(): ClassroomData | null {
    const data = localStorage.getItem(this.selectedClassroomKey);
    return data ? JSON.parse(data) : null;
  }

  getClassroomById(classroomId: string): ClassroomData | null {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];
    
    return classrooms.find((c) => c.classroomId === classroomId) || null;
  }

  getUserClassrooms(userId: string): ClassroomData[] {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];
  
    return classrooms.filter(
      (classroom) =>
        classroom.teacherId === userId || (Array.isArray(classroom.students) && classroom.students.includes(userId))
    );
  }
  
  createClassroom(classroomId: string, classroomName: string, teacherId: string, teacherName: string): void {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];

    classrooms.push({
      classroomId,
      classroomName,
      classroomCode: classroomId.slice(-6),
      createdAt: new Date(),
      teacherId,
      teacherName,
      students: [],
    });

    localStorage.setItem(this.classroomsKey, JSON.stringify(classrooms));
  }

  joinClassroom(classroomCode: string, userId: string): ClassroomData | undefined {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];
  
    const classroom = classrooms.find((c) => c.classroomCode === classroomCode);
  
    if (classroom) {
      classroom.students = classroom.students ?? [];
  
      if (!classroom.students.includes(userId)) {
        classroom.students.push(userId);
        localStorage.setItem(this.classroomsKey, JSON.stringify(classrooms));
      }
    }
  
    return classroom;
  }  

  getClassroomByCode(classroomCode: string): ClassroomData | undefined {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];

    return classrooms.find((c) => c.classroomCode === classroomCode);
  }

  getStudentsInClassroom(classroomId: string): string[] {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];

    const classroom = classrooms.find((c) => c.classroomId === classroomId);
    return classroom ? classroom.students : [];
  }

  leaveClassroom(classroomId: string, userId: string): boolean {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];

    const classroom = classrooms.find((c) => c.classroomId === classroomId);
    if (classroom) {
      classroom.students = classroom.students.filter((studentId) => studentId !== userId);
      localStorage.setItem(this.classroomsKey, JSON.stringify(classrooms));
      return true;
    }
    return false;
  }

  deleteClassroom(classroomId: string): boolean {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];

    const index = classrooms.findIndex((c) => c.classroomId === classroomId);
    if (index !== -1) {
      classrooms.splice(index, 1);
      localStorage.setItem(this.classroomsKey, JSON.stringify(classrooms));
      return true;
    }
    return false;
  }
}
