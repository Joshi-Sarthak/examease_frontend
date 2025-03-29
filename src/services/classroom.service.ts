import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private classroomsKey = 'classrooms';
  private classroomStudentsKey = 'classroomStudents';

  constructor() {}

  private getAllClassrooms(): ClassroomData[] {
    const classrooms = localStorage.getItem(this.classroomsKey);
    return classrooms ? JSON.parse(classrooms) : [];
  }

  private saveClassrooms(classrooms: ClassroomData[]): void {
    localStorage.setItem(this.classroomsKey, JSON.stringify(classrooms));
  }

  private getClassroomStudents(): Record<string, string[]> {
    const students = localStorage.getItem(this.classroomStudentsKey);
    return students ? JSON.parse(students) : {};
  }

  private saveClassroomStudents(students: Record<string, string[]>): void {
    localStorage.setItem(this.classroomStudentsKey, JSON.stringify(students));
  }

  private getStudentClassrooms(userId: string): ClassroomData[] {
    const studentData = localStorage.getItem('classroomStudents');
    if (!studentData) return [];

    const studentMap = JSON.parse(studentData) as Record<string, string[]>;
    const classroomIds = Object.keys(studentMap).filter(classroomId =>
      studentMap[classroomId].includes(userId)
    );

    return this.getAllClassrooms().filter(classroom =>
      classroomIds.includes(classroom.classroomId)
    );
  }

  getUserClassrooms(userId: string): ClassroomData[] {
    const classrooms = this.getAllClassrooms();
    const studentClassrooms = this.getStudentClassrooms(userId);

    return classrooms.filter((classroom) => classroom.teacherId === userId)
      .concat(studentClassrooms);
  }

  createClassroom(classroomId: string, classroomName: string, userId: string): void {
    const classrooms = this.getAllClassrooms();
    const newClassroom: ClassroomData = {
      classroomId,
      classroomName,
      classroomCode: classroomId.slice(-6),
      createdAt: new Date(),
      teacherId: userId,
    };

    classrooms.push(newClassroom);
    this.saveClassrooms(classrooms);
  }

  joinClassroom(classroomCode: string, userId: string): ClassroomData | undefined {
    const classrooms = this.getAllClassrooms();
    const classroom = classrooms.find((c) => c.classroomCode === classroomCode);

    if (classroom) {
      const students = this.getClassroomStudents();
      if (!students[classroom.classroomId]) {
        students[classroom.classroomId] = [];
      }
      if (!students[classroom.classroomId].includes(userId)) {
        students[classroom.classroomId].push(userId);
        this.saveClassroomStudents(students);
      }
    }

    return classroom;
  }

  getClassroomByCode(classroomCode: string): ClassroomData | undefined {
    return this.getAllClassrooms().find((c) => c.classroomCode === classroomCode);
  }

  getClassroomById(classroomId: string): ClassroomData | undefined {
    return this.getAllClassrooms().find((c) => c.classroomId === classroomId);
  }

  getStudentsInClassroom(classroomId: string): string[] {
    const students = this.getClassroomStudents();
    return students[classroomId] || [];
  }
}