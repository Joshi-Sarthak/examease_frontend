import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TestData, QuestionData } from '../models/test.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = 'http://localhost:5000/test';

  constructor(private http: HttpClient) {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getTestsForClassroom(classroomId: string): Observable<TestData[]> {
    return this.http.get<{ tests?: any[]; error?: string }>(`${this.apiUrl}/${classroomId}`).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return (response.tests || []).map(t => this.mapTest(t));
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveTest(
    testName: string,
    questions: QuestionData[],
    startFrom: Date,
    deadlineTime: Date,
    testTime: number,
    classroomId: string,
    teacherId: string
  ): Observable<TestData> {
    return this.http.post<{ 
      message: string; 
      testName: string; 
      questions: QuestionData[]; 
      startFrom: Date; 
      deadlineTime: Date; 
      testTime: number; 
      classroomId: string; 
      teacherId: string; 
      testId: string; 
      error?: string;
    }>(`${this.apiUrl}/create`, {
      testName,
      questions,
      startFrom,
      deadlineTime,
      testTime,
      classroomId,
      teacherId
    }).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return this.mapTest(response);
      }),
      catchError(err => this.handleError(err))
    );
  }  

  updateTest(
    testId: string,
    testName: string,
    questions: QuestionData[],
    startFrom: Date,
    deadlineTime: Date,
    testTime: number,
    classroomId: string,
    teacherId: string
  ): Observable<TestData> {
    const testPayload = {
      testId,
      testName,
      questions,
      startFrom,
      deadlineTime,
      testTime,
      classroomId,
      teacherId
    };
  
    console.log("Updating test with data:", JSON.stringify(testPayload, null, 2));
  
    return this.http.put<{ 
      message: string; 
      test: any; 
      error?: string 
    }>(`${this.apiUrl}/edit`, testPayload).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return this.mapTest(response.test);
      }),
      catchError(err => this.handleError(err))
    );
  }   

  getTestById(testId: string): Observable<TestData | null> {
    return this.http.get<{ test?: any; error?: string }>(`${this.apiUrl}/get/${testId}`).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return this.mapTest(response.test);
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteTest(testId: string, teacherId: string): Observable<{ message: string }> {
    console.log(`${this.apiUrl}/delete/${testId}/${teacherId}`);
    return this.http.delete<{ message: string; error?: string }>(`${this.apiUrl}/delete/${testId}/${teacherId}`).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return response;
      }),
      catchError(err => this.handleError(err))
    );
  }

  saveResult(testId: string, studentId: string, result: number): Observable<{ message: string }> {
    return this.http.post<{ message: string; error?: string }>(`${this.apiUrl}/submit-result`, { testId, studentId, result }).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return response;
      }),
      catchError(err => this.handleError(err))
    );
  }

  getDetailedTestResults(testId: string): Observable<any> {
    return this.http.get<{ results?: any[]; error?: string }>(`${this.apiUrl}/detailed-results/${testId}`).pipe(
      map(response => {
        if (response.error) throw new Error(response.error);
        return response.results || [];
      }),
      catchError(err => this.handleError(err))
    );
  }  

  setTest(test: TestData | null): void {
    if (!this.isBrowser) return;
    localStorage.setItem('selected_test', JSON.stringify(test));
  }

  getTest(): TestData | null {
    if (!this.isBrowser) return null;
    return JSON.parse(localStorage.getItem('selected_test') || 'null');
  }

  private mapTest(test: any): TestData {
    return {
      testId: test._id,
      testName: test.testName,
      questions: test.questions || [],
      postedAt: new Date(test.postedAt),
      startFrom: new Date(test.startFrom),
      deadlineTime: new Date(test.deadlineTime),
      testTime: test.testTime,
      result: test.result || [],
      classroomId: test.classroomId
    };
  }

  private handleError(err: any) {
    console.error('HTTP Error:', err);
    return throwError(() => err.error?.error || 'Something went wrong');
  }
}