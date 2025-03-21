import { Injectable } from '@angular/core';
import { TestData } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor() {}

  private getTestsForClassroom(classroomId: string): TestData[] {
    return JSON.parse(localStorage.getItem(`tests_${classroomId}`) || '[]');
  }

  getTests(classroomId: string): TestData[] {
    return this.getTestsForClassroom(classroomId);
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
