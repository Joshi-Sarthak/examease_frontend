import { Injectable } from '@angular/core';
import { TestData } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private getTestsForClassroom(classroomId: string): TestData[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem(`tests_${classroomId}`) || '[]');
  }

  getTests(classroomId: string): TestData[] {
    return this.getTestsForClassroom(classroomId);
  }

  saveTest(test: TestData): void {
    if (!this.isBrowser) return;
    const tests = this.getTestsForClassroom(test.classroomId!);
    const existingIndex = tests.findIndex((t) => t.testId === test.testId);
    if (existingIndex !== -1) {
      tests[existingIndex] = test;
    } else {
      tests.push(test);
    }
    localStorage.setItem(`tests_${test.classroomId}`, JSON.stringify(tests));
  }

  getTest(testId: string, classroomId: string): TestData | undefined {
    return this.getTestsForClassroom(classroomId).find((t) => t.testId === testId);
  }

  deleteTest(classroomId: string, testId: string): void {
    if (!this.isBrowser) return;
    const tests = this.getTestsForClassroom(classroomId).filter((t) => t.testId !== testId);
    localStorage.setItem(`tests_${classroomId}`, JSON.stringify(tests));
  }
}
