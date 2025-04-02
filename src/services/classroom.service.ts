import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ClassroomData } from '../models/classroom.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private apiUrl = 'http://localhost:5000/classroom';

  constructor(private http: HttpClient) {}

  getClassroomById(classroomId: string): Observable<ClassroomData | null> {
    return this.http.get<{ classroom: any; error?: string }>(`${this.apiUrl}/id/${classroomId}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return this.mapClassroom(response.classroom);
      }),
      catchError(err => this.handleError(err))
    );
  }

  getClassroomsForTeacher(userId: string): Observable<ClassroomData[]> {
    return this.http.get<{ classrooms?: any[]; error?: string }>(`${this.apiUrl}/teacher/${userId}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return (response.classrooms || []).map(c => this.mapClassroom(c)).filter((c): c is ClassroomData => c !== null);
      }),
      catchError(err => this.handleError(err))
    );
  }

  getClassroomsForStudent(userId: string): Observable<ClassroomData[]> {
    return this.http.get<{ classrooms?: any[]; error?: string }>(`${this.apiUrl}/student/${userId}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return (response.classrooms || []).map(c => this.mapClassroom(c)).filter((c): c is ClassroomData => c !== null);
      }),
      catchError(err => this.handleError(err))
    );
  }

  getUserClassrooms(userId: string): Observable<ClassroomData[]> {
    return forkJoin([
      this.getClassroomsForTeacher(userId),
      this.getClassroomsForStudent(userId)
    ]).pipe(
      map(([teacherClassrooms, studentClassrooms]) => [...teacherClassrooms, ...studentClassrooms]),
      catchError(err => this.handleError(err))
    );
  }

  createClassroom(classroomName: string, teacherId: string, teacherName: string): Observable<ClassroomData | null> {
    return this.http.post<{ message: string; classroom: any; error?: string }>(`${this.apiUrl}/create`, {
      classroomName,
      teacherId,
      teacherName
    }).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return this.mapClassroom(response.classroom);
      }),
      catchError(err => this.handleError(err))
    );
  }

  joinClassroom(userId: string, classroomCode: string): Observable<ClassroomData | null> {
    return this.http.post<{ message?: string; classroom?: any; error?: string }>(
      `${this.apiUrl}/join`, 
      { userId, classroomCode }, 
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return this.mapClassroom(response.classroom);
      }),
      catchError(err => this.handleError(err))
    );
  }  

  leaveClassroom(userId: string, classroomId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string; error?: string }>(`${this.apiUrl}/leave`, {
      userId,
      classroomId
    }).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response;
      }),
      catchError(err => this.handleError(err))
    );
  }

  deleteClassroom(userId: string, classroomId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string; error?: string }>(`${this.apiUrl}/delete/${userId}/${classroomId}`).pipe(
      map(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response;
      }),
      catchError(err => this.handleError(err))
    );
  }

  private mapClassroom(classroom: any): ClassroomData | null {
    if (!classroom) {
      return null;
    }
    
    const mappedClassroom: ClassroomData = {
      classroomId: classroom._id,
      classroomName: classroom.classroomName,
      classroomCode: classroom.classroomCode,
      teacherId: classroom.teacherId,
      teacherName: classroom.teacherName,
      students: classroom.students || [],
      createdAt: classroom.createdAt
    };
  
    console.log('Mapped Classroom:', mappedClassroom);
    return mappedClassroom;
  }  

  setClassroom(classroom: ClassroomData | null): void {
    localStorage.setItem('selectedClassroom', JSON.stringify(classroom));
  }

  getClassroom(): ClassroomData | null {
    const data = localStorage.getItem('selectedClassroom');
    return data ? JSON.parse(data) : null;
  }

  private handleError(err: any) {
    console.error('HTTP Error:', err);
    const errorMessage = err.error?.error || 'Something went wrong';
    return throwError(() => errorMessage);
  }
}