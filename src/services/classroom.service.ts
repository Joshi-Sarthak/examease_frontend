import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private classroomsKey = 'classrooms';

  constructor() {}

  private getAllClassrooms(): ClassroomData[] {
    const classrooms = localStorage.getItem(this.classroomsKey);
    return classrooms ? JSON.parse(classrooms) : [];
  }

  private saveClassrooms(classrooms: ClassroomData[]): void {
    localStorage.setItem(this.classroomsKey, JSON.stringify(classrooms));
  }

  getUserClassrooms(userId: string): ClassroomData[] {
    return this.getAllClassrooms().filter(
      (classroom) => classroom.teacherId === userId || classroom.role === 'student'
    );
  }

  createClassroom(classroomId: string, classroomName: string, userId: string): void {
    const classrooms = this.getAllClassrooms();
    const newClassroom: ClassroomData = {
      classroomId,
      classroomName,
      classroomCode: classroomId.slice(-6),
      createdAt: new Date(),
      teacherId: userId,
      role: 'teacher',
    };

    classrooms.push(newClassroom);
    this.saveClassrooms(classrooms);
  }

  joinClassroom(classroomCode: string, userId: string): ClassroomData | undefined {
    const classrooms = this.getAllClassrooms();
    const classroom = classrooms.find((c) => c.classroomCode === classroomCode);

    if (classroom) {
      classroom.role = 'student';
      this.saveClassrooms(classrooms);
    }

    return classroom;
  }

  getClassroomByCode(classroomCode: string): ClassroomData | undefined {
    return this.getAllClassrooms().find((c) => c.classroomCode === classroomCode);
  }

  getClassroomById(classroomId: string): ClassroomData | undefined {
    return this.getAllClassrooms().find((c) => c.classroomId === classroomId);
  }
}
