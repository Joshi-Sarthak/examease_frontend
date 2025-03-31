import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private classroomsKey = 'classrooms';
  private selectedClassroomKey = 'selectedClassroom';

  constructor() {}

  // keep it as it is
  setClassroom(classroom: ClassroomData | null): void {
    localStorage.setItem(this.selectedClassroomKey, JSON.stringify(classroom));
  }

  //keep it as it is
  getClassroom(): ClassroomData | null {
    console.log('Before', JSON.parse(localStorage.getItem(this.selectedClassroomKey)!));
    const data = localStorage.getItem(this.selectedClassroomKey);
    console.log('After:', JSON.parse(data!));
    return data ? JSON.parse(data) : null;
  }  

  getClassroomById(classroomId: string): ClassroomData | null {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];
    
    return classrooms.find((c) => c.classroomId === classroomId) || null;
  }

  getClassroomsForTeachers(userId: string): ClassroomData[] {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];
  
    return classrooms.filter(
      (classroom) =>
        classroom.teacherId === userId
    );
  }

  getClassroomsForStudents(userId: string): ClassroomData[] {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];
  
    return classrooms.filter(
      (classroom) =>
        (Array.isArray(classroom.students) && classroom.students.includes(userId))
    );
  }

  getUserClassrooms(userId: string): ClassroomData[] {
    console.log('Getting classrooms for user:', userId);
  
    const data = localStorage.getItem(this.classroomsKey);
    if (!data) {
      console.log('No classrooms found in localStorage.');
      return [];
    }
  
    const classrooms: ClassroomData[] = JSON.parse(data);
  
    const filteredClassrooms = classrooms.filter(
      (classroom) =>
        classroom.teacherId === userId ||
        (Array.isArray(classroom.students) && classroom.students.includes(userId))
    );
  
    console.log('Filtered classrooms:', filteredClassrooms);
    return filteredClassrooms;
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
    console.log(JSON.parse(localStorage.getItem('classrooms')!));
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

    console.log('Classroom after joining:', classroom);
  
    return classroom;
  }  

  getClassroomByCode(classroomCode: string): ClassroomData | undefined {
    const data = localStorage.getItem(this.classroomsKey);
    const classrooms: ClassroomData[] = data ? JSON.parse(data) : [];

    return classrooms.find((c) => c.classroomCode === classroomCode);
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
