import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';
import { TestData } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private classroomsKey = 'classrooms';
  private userRoleKey = 'userRole';

  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private getLocalStorageItem<T>(key: string, defaultValue: T): T {
    if (this.isBrowser) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (error) {
        console.error(`Error reading key "${key}" from localStorage:`, error);
      }
    }
    return defaultValue;
  }

  private setLocalStorageItem(key: string, value: any): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error saving key "${key}" to localStorage:`, error);
      }
    }
  }

  // ---------- Classroom Methods ----------
  getClassrooms(classroomId: string, userName: string): ClassroomData[] {
    return this.getLocalStorageItem<ClassroomData[]>(this.classroomsKey, []);
  }

  createClassroom(classroomId: string, classroomName: string, teacherName: string): void {
    const classrooms = this.getClassrooms(classroomId, teacherName);
    const newClassroom: ClassroomData = {
      classroomId,
      classroomName,
      classroomCode: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date(),
      role: 'teacher',
      students: [],
    };
    classrooms.push(newClassroom);
    this.setLocalStorageItem(this.classroomsKey, classrooms);
    this.setLocalStorageItem(this.userRoleKey, { [classroomId]: 'teacher' }); // Store user role per classroom
  }

  getClassroomByCode(classroomCode: string): ClassroomData | undefined {
      return this.getClassrooms('', '').find(c => c.classroomCode === classroomCode);
  }

  joinClassroom(classroomCode: string, userName: string): ClassroomData | undefined {
    const classrooms = this.getClassrooms('', userName);
    const classroom = classrooms.find(c => c.classroomCode === classroomCode);
    if (classroom) {
      if (!classroom.students.includes(userName)) {
        classroom.students.push(userName);
        this.setLocalStorageItem(this.classroomsKey, classrooms);
        this.setLocalStorageItem(this.userRoleKey, { [classroom.classroomId]: 'student' }); // Store user role per classroom
      }
      return classroom;
    }
    return undefined;
  }

  getUserRole(classroomId: string): 'teacher' | 'student' | null {
    const roles = this.getLocalStorageItem<Record<string, 'teacher' | 'student'>>(this.userRoleKey, {});
    return roles[classroomId] || null;
  }

  // ---------- Test Methods ----------
  getTestsForClassroom(classroomId: string): TestData[] {
    return this.getLocalStorageItem<TestData[]>(`tests_${classroomId}`, []);
  }

  saveTest(test: TestData): void {
    const tests = this.getTestsForClassroom(test.classroomId!);
    const existingIndex = tests.findIndex(t => t.testId === test.testId);
    if (existingIndex !== -1) {
      tests[existingIndex] = test;
    } else {
      tests.push(test);
    }
    this.setLocalStorageItem(`tests_${test.classroomId}`, tests);
  }

  getTest(testId: string, classroomId: string): TestData | undefined {
    return this.getTestsForClassroom(classroomId).find(t => t.testId === testId);
  }
}
