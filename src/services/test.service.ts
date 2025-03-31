import { Injectable } from '@angular/core';
import { TestData, Result } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getTestsForClassroom(classroomId: string): TestData[] {
    if (!this.isBrowser) return [];
    return JSON.parse(localStorage.getItem(`tests_${classroomId}`) || '[]');
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

  getTestById(testId: string): TestData | null {
    if (!this.isBrowser) return null;
    for (const classroomId of Object.keys(localStorage)
      .filter((key) => key.startsWith('tests_'))
      .map((key) => key.replace('tests_', ''))) {
      const test = this.getTestsForClassroom(classroomId).find((t) => t.testId === testId);
      if (test) return test;
    }
    return null;
  }  

  deleteTest(classroomId: string, testId: string): void {
    if (!this.isBrowser) return;
    const tests = this.getTestsForClassroom(classroomId).filter((t) => t.testId !== testId);
    localStorage.setItem(`tests_${classroomId}`, JSON.stringify(tests));
  }

  saveResult(testId: string, result: Result): void {
    if (!this.isBrowser) return;
    const test = this.getTestById(testId);
    if (test) {
      test.result = test.result || [];
      test.result.push(result);
      this.saveTest(test);
    }
  }

  setTest(test: TestData | null): void {
    if (!this.isBrowser) return;
    localStorage.setItem('selected_test', JSON.stringify(test));
  }
  
  getTest(): TestData | null {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('selected_test') || 'null');
  }  
}
