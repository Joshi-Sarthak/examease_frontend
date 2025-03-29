import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private classroomsKey = 'classrooms';
  private classroomStudentsKey = 'classroomStudents';

  constructor() {}

  private getFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  }

  private saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private getAllClassrooms(): ClassroomData[] {
    return this.getFromLocalStorage(this.classroomsKey) || [];
  }

  private saveClassrooms(classrooms: ClassroomData[]): void {
    this.saveToLocalStorage(this.classroomsKey, classrooms);
  }

  private getClassroomStudents(): Record<string, string[]> {
    return this.getFromLocalStorage(this.classroomStudentsKey);
  }

  private saveClassroomStudents(students: Record<string, string[]>): void {
    this.saveToLocalStorage(this.classroomStudentsKey, students);
  }

  private getStudentClassrooms(userId: string): ClassroomData[] {
    const studentMap = this.getClassroomStudents();
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
      const classroomId = classroom.classroomId;

      if (!students[classroomId]) {
        students[classroomId] = [];
      }

      if (!students[classroomId].includes(userId)) {
        students[classroomId].push(userId);
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