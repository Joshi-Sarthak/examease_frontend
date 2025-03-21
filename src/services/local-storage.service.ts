import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';
import { TestData } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private classroomsKey = 'classrooms';

  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // ---------- Classroom Methods ----------
  getClassrooms(): ClassroomData[] {
    if (this.isBrowser) {
      const classrooms = localStorage.getItem(this.classroomsKey);
      return classrooms ? JSON.parse(classrooms) : [];
    }
    return [];
  }

  saveClassroom(classroom: ClassroomData): void {
    const classrooms = this.getClassrooms();
    classrooms.push(classroom);
    localStorage.setItem(this.classroomsKey, JSON.stringify(classrooms));
  }

  // Add this method to find a classroom by its code
  getClassroomByCode(classroomCode: string): ClassroomData | undefined {
    return this.getClassrooms().find(c => c.classroomCode === classroomCode);
  }

  // ---------- Test Methods ----------
  getTestsForClassroom(classroomId: string): TestData[] {
    return JSON.parse(localStorage.getItem(`tests_${classroomId}`) || '[]');
  }

  saveTest(test: TestData): void {
    const tests = this.getTestsForClassroom(test.classroomId!);
    const existingIndex = tests.findIndex(t => t.testId === test.testId);
    if (existingIndex !== -1) {
      tests[existingIndex] = test;
    } else {
      tests.push(test);
    }
    localStorage.setItem(`tests_${test.classroomId}`, JSON.stringify(tests));
  }

  getTest(testId: string, classroomId: string): TestData | undefined {
    const tests = this.getTestsForClassroom(classroomId);
    return tests.find(t => t.testId === testId);
  }
}
