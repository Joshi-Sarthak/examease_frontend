import { Injectable } from '@angular/core';
import { ClassroomData } from '../models/classroom.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private classroomsKey = 'classrooms';

  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

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

  getClassroomByCode(classroomCode: string): ClassroomData | undefined {
    return this.getClassrooms().find(c => c.classroomCode === classroomCode);
  }
}
